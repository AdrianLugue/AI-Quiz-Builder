"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import {ChevronLeft, X} from "lucide-react"
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";
import { InferSelectModel } from "drizzle-orm";
import { questionAnswers, questions as DbQuestions, Quizzes} from "@/db/schema";
import { useRouter } from "next/navigation";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quiz = InferSelectModel<typeof Quizzes> & {questions: Question[]};

type Props = {
    Quiz: Quiz;
}

export default function QuizQuestions(props: Props) {
    const { questions } = props.Quiz;

    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 mt-24">
                <h2 className="text-2xl font-bold">This quiz has no questions.</h2>
            </div>
        )
    }

    const [started, setStarted] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score,setScore] = useState<number>(0);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [userAnswers, setUserAnswers] = useState<{questionId: number, answerId: number}[]>([]);
    const router = useRouter();
    
    const handleNext = () =>{
    if (!started){
     setStarted(true);
     return;
    }

    if(currentQuestion < questions.length - 1){
      setCurrentQuestion(currentQuestion + 1);
    }else{
      setSubmitted(true);
    }


    }
    
    const handleAnswer = (answer: Answer, QuestionId: number) => {
        const newUserAnswerArr = [...userAnswers, {
            answerId: answer.id,
            questionId: QuestionId
        }]
        setUserAnswers(newUserAnswerArr);
        const isCurrentCorrect = answer.isCorrect;
        if (isCurrentCorrect){
            setScore(score +1);
        }

    }

    const handlePressPrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        } else {
            setStarted(false);
        }

    }

    const handleExit = () => {
        router.push("/dashboard");
    }

    const scorePercentage = Math.round((score / questions.length) * 100);
    const selectedAnswer: number | null | undefined = userAnswers.find((item) => item.questionId === questions[currentQuestion].id)?.answerId
    const isCorrect: boolean | null | undefined = 
    questions[currentQuestion]?.answers.findIndex((answer) => answer.id === selectedAnswer) ? questions[currentQuestion]?.answers.find((answer) => answer.id === selectedAnswer)?.isCorrect : null;


    if (submitted){
        return <QuizSubmission 
        score={score} 
        scorePercentage={scorePercentage}  
        totalQuestions={questions.length} />
    }

  return (
    <div className="flex flex-col flex-1">
        <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
         <header className="grid grid-cols-[auto,1fr,auto] gird-flow-col items-center justify-between py-2 gap-2">
            <Button variant= "outline" onClick={handlePressPrev}><ChevronLeft /></Button>
            <ProgressBar value={currentQuestion / questions.length * 100} />
            <Button variant="outline" onClick={handleExit}><X /></Button>
         </header>
        </div>
    <main className="flex flex-1 justify-center">
      {!started ? <h1 className="text-3xl font-bold">Welcome to the Quiz Page</h1> 
      :<div>
       <h2 className="text-2xl font-bold">{questions[currentQuestion].questionText}</h2>
        <div className="grid grid-cols-1 gap-6 mt-6">
        {
        questions[currentQuestion].answers.map((answer) => {
            const variant = selectedAnswer === answer.id ? (answer.isCorrect ? "success" : "danger") : "neo";
            return (
          <Button variant={variant} key={answer.id} onClick={() => handleAnswer(answer, questions[currentQuestion].id)} disabled={!!selectedAnswer}>
            {answer.answerText}
            </Button>
          )
        })
        }
        </div>
      </div>
      }
    </main>
    <footer className="footer pb-9 px-6 relative mb-0">
      <ResultCard isCorrect={isCorrect} correctAnswer={questions[currentQuestion]?.answers?.find(answer => answer.isCorrect == true)?.answerText || ""} />
      <Button variant="neo" size="lg" onClick={handleNext} >{!started ? "Start" : (currentQuestion === questions.length - 1) ? "Submit" : "Next"}</Button>
    </footer>
    </div>
  )
}
