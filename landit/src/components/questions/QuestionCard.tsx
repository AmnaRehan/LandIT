"use client";
import React, { useState } from "react";
import { Question } from "@/types/questions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { evaluateAnswer } from "@/lib/gemini";
import { FeedbackDisplay } from "./FeedbackDisplay";

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string, score: number, feedback: string, isCorrect: boolean) => void;
  existingAnswer?: {
    answer: string;
    score: number;
    feedback: string;
    isCorrect: boolean;
  };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSubmit,
  existingAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(existingAnswer?.answer || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(existingAnswer || null);

  const handleSubmit = async () => {
    if (!selectedAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const evaluation = await evaluateAnswer(
        question.text,
        selectedAnswer,
        question.correctAnswer
      );

      setFeedback({
        answer: selectedAnswer,
        ...evaluation,
      });

      onSubmit(
        selectedAnswer,
        evaluation.score,
        evaluation.feedback,
        evaluation.isCorrect
      );
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  return (
    <Card className="mb-4">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {question.text}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            difficultyColors[question.difficulty]
          }`}
        >
          {question.difficulty.toUpperCase()}
        </span>
      </div>

      {question.type === "multiple-choice" && question.options ? (
        <div className="space-y-2 mb-4">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAnswer === option
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={!!feedback}
                className="mr-3"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          disabled={!!feedback}
          placeholder="Type your answer here..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none mb-4 min-h-[100px] resize-none"
        />
      )}

      {feedback ? (
        <FeedbackDisplay
          score={feedback.score}
          feedback={feedback.feedback}
          isCorrect={feedback.isCorrect}
        />
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Evaluating..." : "Submit Answer"}
        </Button>
      )}
    </Card>
  );
};