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


export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const usersRelations = relations(users, ({ many }) => ({
    Quizzes: many(Quizzes),
}));
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => (
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    }
  )
);
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => (
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    }
  )
);
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => (
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    }
  )
);



export const Quizzes = pgTable("Quizzes", {
    id: serial("id").primaryKey(),
    name: text("name"),
    description: text("description"),
    userId: text("user_id").references(() => users.id),

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