"use client";
import React from "react";
import { DifficultySelector } from "@/components/questions/difficultySelector";
import { QuestionList } from "@/components/questions/QuestionList";
import { useQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/Button";

export default function QuestionsPage() {
  // Replace with actual user ID from auth
  const userId = "user_123";

  const {
    difficulty,
    setDifficulty,
    questions,
    jobDescription,
    isGenerating,
    generateQuestions,
    submitAnswer,
  } = useQuestions(userId);

  const handleSubmitAnswer = async (
    questionId: string,
    answer: string,
    score: number,
    feedback: string,
    isCorrect: boolean
  ) => {
    try {
      await submitAnswer({
        questionId,
        userId,
        answer,
        score,
        feedback,
        isCorrect,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  if (!jobDescription) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Job Description Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please create a job description first to generate relevant questions.
          </p>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 text-gray-700 mb-4 hover:text-gray-900"
          >
            <span>←</span> Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Questions
          </h1>
          <p className="text-gray-600">
            {jobDescription.title} - Test your knowledge
          </p>
        </div>

        <DifficultySelector selected={difficulty} onChange={setDifficulty} />

        <div className="mb-6 flex justify-center">
          <Button
            onClick={generateQuestions}
            disabled={isGenerating}
            className="px-8"
          >
            {isGenerating ? "Generating..." : "🔄 Generate New Questions"}
          </Button>
        </div>

        <QuestionList
          questions={questions as any}
          onSubmitAnswer={handleSubmitAnswer}
          isLoading={isGenerating}
        />
      </div>
    </div>
  );
}