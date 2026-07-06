import {db } from "@/db"
import { Quizzes, questions as dbQuestions, questionAnswers } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type Quiz = InferInsertModel<typeof Quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

interface SaveQuizData extends Quiz {
    questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveQuiz(quizData: SaveQuizData) {
    const{name, description, questions} = quizData;

    const newQuiz = await db.insert(Quizzes).values({
        name,
        description,
    }).returning({ insertedId: Quizzes.id });
    const QuizId = newQuiz[0].insertedId;

    await db.transaction(async(tx) => {
        for(const question of questions){
            const [{questionId}] = await tx.insert(dbQuestions).values({
                questionText: question.questionText,
                quizId: QuizId
            }).returning({questionId: dbQuestions.id});
            
            if(question.answers && question.answers.length > 0){
                await tx.insert(questionAnswers).values(
                    question.answers.map(answer => ({
                        questionId: questionId,
                        answerText: answer.answerText,
                        isCorrect: answer.isCorrect
                    }))
                );
            }
        }
    });

    return { QuizId };
}