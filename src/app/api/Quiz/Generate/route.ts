import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { JsonOutputKeyToolsParser } from "langchain/output_parsers";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import saveQuiz from "./saveToDb";

export async function POST(req:NextRequest) {
    const body = await req.formData();
    const document = body.get("pdf");

    try {
        const pdfLoader = new PDFLoader(document as Blob, {
            parsedItemSeparator: " "
        });
        const docs = await pdfLoader.load();

        const selectedDocuments = docs.filter((doc) => 
            doc.pageContent !== undefined);
        const texts = selectedDocuments.map((doc) => doc.pageContent);
        
        const prompt = `
        given the text which is a summary of the document, generate a quiz based on the text. 
        Return json only that contains a quizz object with
        fields: name, description and questions. The questions is an array of objects
        with fields: questionText, answers. The answers is an array of objects with
        fields: answerText, isCorrect.
        `;

        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not defined");
        }

        const model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.3-70b-versatile",
        });


        const parser = new JsonOutputKeyToolsParser({
            keyName: "extractor",
            returnSingle: true,
        });
        const extractionFunctionSchema = {
            name: "extractor",
            description: "Extracts fields from the output",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string"},
                    description: { type: "string" },
                    questions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                questionText: { type: "string" },
                                answers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            answerText: { type: "string" },
                                            isCorrect: { type: "boolean" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                required: ["name", "description", "questions"]
            }
        };
        
        const runnable = model.bindTools([
            {
                type: "function",
                function: extractionFunctionSchema
            }
        ], {
        tool_choice: { type: "function", function: { name: "extractor" } }
        }).pipe(parser as any);

        const message = new HumanMessage({
          content: [
            {
                type: "text",
                text: prompt + "\n" + texts.join("\n")
            }
          ]
        });
        
       const result = await runnable.invoke([message]);
       console.log(result);

       const {QuizId} = await saveQuiz(result as any);

       return NextResponse.json({message: "Created Successfully", quizId: QuizId}, {status: 200})
    } catch (e:any) {
        return NextResponse.json({error: e.message}, { status: 500})
    }
}