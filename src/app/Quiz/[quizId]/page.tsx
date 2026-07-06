import { db } from "@/db";

import { Quizzes } from "@/db/schema";
import {eq} from "drizzle-orm";
import QuizQuestions from "../QuizQuestions";
import { string } from "zod";

const page = async ({params}: {
    params: {
        quizId: string
    }
}) => {
    const quizId =  params.quizId;
    const Quiz = await db.query.Quizzes.findFirst({
        where: eq(Quizzes.id, parseInt(quizId)),
        with: {
            questions: {
                with: {
                    answers: true,
                }
            }
        }
    })

    if (!quizId || !Quiz) {
        return <div>Quiz not found</div>
    }
    return (
        <QuizQuestions Quiz={Quiz}/>
    )
}

export default page;