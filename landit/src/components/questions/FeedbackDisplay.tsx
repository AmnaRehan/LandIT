import React from "react";

interface FeedbackDisplayProps {
  score: number;
  feedback: string;
  isCorrect: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  score,
  feedback,
  isCorrect,
}) => {
  return (
    <div
      className={`p-4 rounded-lg ${
        isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-orange-50 border-2 border-orange-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">
          {isCorrect ? "✓ Correct!" : "⚠ Needs Improvement"}
        </span>
        <span className="text-2xl font-bold text-gray-900">{score}/10</span>
      </div>
      <p className="text-gray-700 text-sm">{feedback}</p>
    </div>
  );
};
