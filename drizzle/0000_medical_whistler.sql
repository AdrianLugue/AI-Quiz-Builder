CREATE TABLE IF NOT EXISTS "Quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questionAnswers" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer,
	"answer_text" text,
	"is_correct" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_text" text,
	"quiz_id" integer
);
