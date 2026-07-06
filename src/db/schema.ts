import{
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    serial,
    boolean,
    pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters"; 
import { relations } from "drizzle-orm";

export const Quizzes = pgTable("Quizzes", {
    id: serial("id").primaryKey(),
    name: text("name"),
    description: text("description"),
    userId: text("user_id"),

});

export const quizzesRelations =  relations(Quizzes, ({many, one}) => ({
    questions: many(questions),
}))

export const questions = pgTable("questions", {
    id: serial("id").primaryKey(),
    questionText: text("question_text"),
    quizId: integer("quiz_id"),
    
});

export const questionAnswers = pgTable("questionAnswers", {
    id: serial("id").primaryKey(),
    questionId: integer("question_id"),
    answerText: text("answer_text"),
    isCorrect: boolean("is_correct"),
});

export const questionsRelations = relations(questions, ({one, many}) =>({
    Quiz: one(Quizzes, {
        fields: [questions.quizId],
        references: [Quizzes.id],
    }),
    answers: many(questionAnswers),
}));

export const questionAnswersRelations = relations(questionAnswers, ({one}) => ({
    question: one(questions, {
        fields: [questionAnswers.questionId],
        references: [questions.id],
    })
}))