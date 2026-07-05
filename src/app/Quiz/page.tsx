"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import {ChevronLeft, X} from "lucide-react"
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";

const questions = [
  {
    questionText: "What is React?",
    answers: 
    [
      {answerText: "A library for building user interfaces" , isCorrect: true, id: 1},
      {answerText: "A framework for building user interfaces" , isCorrect: false, id: 2},
      {answerText: "A library for building user interfaces" , isCorrect: false, id: 3},
      {answerText: "A library for building user interfaces" , isCorrect: false, id: 4}
    ]
  },
  {
    questionText: "What is JSX?",
    answers:
    [
      {answerText: "JavaScript and XML" , isCorrect: true, id: 1},
      {answerText: "JavaScript and XML" , isCorrect: false, id: 2},
      {answerText: "JavaScript and XML" , isCorrect: false, id: 3},
      {answerText: "JavaScript and XML" , isCorrect: false, id: 4}
    ]
  },
  {
    questionText: "What is a component?",
    answers:
    [
      {answerText: "a function that returns JSX", isCorrect: true, id: 1},
      {answerText: "a function that returns JSX", isCorrect: false, id: 2},
      {answerText: "a function that returns JSX", isCorrect: false, id: 3},
      {answerText: "a function that returns JSX", isCorrect: false, id: 4}
    ]
  }
]


export default function Home() {
    const [started, setStarted] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score,setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

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

    setSelectedAnswer(null);
    setIsCorrect(null);
    }
    
    const handleAnswer = (answer: any) => {
        setSelectedAnswer(answer.id);
        const isCurrentCorrect = answer.isCorrect;
        if (isCurrentCorrect){
            setScore(score +1);
        }
        setIsCorrect(isCurrentCorrect);
    }

    const scorePercentage = Math.round((score / questions.length) * 100);

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
            <Button variant= "outline"><ChevronLeft /></Button>
            <ProgressBar value={currentQuestion / questions.length * 100} />
            <Button variant="outline"><X /></Button>
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
          <Button variant={variant} key={answer.id} onClick={() => handleAnswer(answer)}>
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
      <ResultCard isCorrect={isCorrect} correctAnswer={questions[currentQuestion].answers.find(answer => answer.isCorrect == true)?.answerText ?? ""} />
      <Button variant="neo" size="lg" onClick={handleNext} >{!started ? "Start" : (currentQuestion === questions.length - 1) ? "Submit" : "Next"}</Button>
    </footer>
    </div>
  )
}
