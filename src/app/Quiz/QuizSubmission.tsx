import Bar from "./Bar"
import Image from "next/image"
import {useReward} from 'react-rewards';
import { useEffect } from "react";

type Props = {
    scorePercentage: number,
    score: number,
    totalQuestions: number,
}

const QuizSubmission = (props: Props) => {
    const {scorePercentage, score, totalQuestions} = props;
    const {reward} = useReward('rewardId', 'confetti');
    useEffect(() => {
     if (scorePercentage==100){
      reward();
     }
    }, [scorePercentage, reward]);

     return (
        <div className="flex flex-col flex-1">
            <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
                <h2 className="text-3xl font-bold">Quiz Complete</h2>
                <p className="text-lg font-semibold">You Scored: {scorePercentage}% </p>
                <p className="text-lg font-semibold">You got {score}/{totalQuestions} Questions Correct</p>
                <div className="flex flex-row gap-8 mt-6">
                    <Bar percentage={scorePercentage} color="green" />
                    <Bar percentage={100 - scorePercentage} color="red" />
                </div>
                <span id="rewardId"></span>
            </main>
        </div>
     )
}

export default QuizSubmission;
    