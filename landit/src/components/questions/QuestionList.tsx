"use client";
import React from "react";
import { Question } from "@/types/questions";
import { QuestionCard } from "./QuestionCard";
import { LoadingState } from "./LoadingState";

interface QuestionListProps {
  questions: Question[];
  onSubmitAnswer: (
    questionId: string,
    answer: string,
    score: number,
    feedback: string,
    isCorrect: boolean
  ) => void;
  isLoading?: boolean;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onSubmitAnswer,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No questions available for this difficulty.</p>
        <p className="text-sm text-gray-500">Click "Generate Questions" to create new ones!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard
          key={question._id}
          question={question}
          onSubmit={(answer, score, feedback, isCorrect) =>
            onSubmitAnswer(question._id!, answer, score, feedback, isCorrect)
          }
        />
      ))}
    </div>
  );
};
