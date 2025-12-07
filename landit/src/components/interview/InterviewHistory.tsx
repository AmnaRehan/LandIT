// ============================================
// FILE PATH: src/components/interview/InterviewHistory.tsx
// ============================================
// Create this NEW file - History list screen

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowLeft, Clock, MessageSquare, TrendingUp } from "lucide-react";
import InterviewFeedback from "./InterviewFeedback";

interface InterviewHistoryProps {
  history: any[];
  onBack: () => void;
}

export default function InterviewHistory({ history, onBack }: InterviewHistoryProps) {
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

  if (selectedInterviewId) {
    return (
      <InterviewFeedback
        interviewId={selectedInterviewId}
        onClose={() => setSelectedInterviewId(null)}
      />
    );
  }

  const completedInterviews = history.filter((i) => i.status === "completed");

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-700 border-green-300";
    if (score >= 6) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
        <p className="text-gray-600 mt-2">
          {completedInterviews.length} completed interview{completedInterviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Interview List */}
      {completedInterviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-4">No completed interviews yet</p>
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Start your first interview
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {completedInterviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              interview={interview}
              onClick={() => setSelectedInterviewId(interview._id)}
              formatDuration={formatDuration}
              getScoreBadgeColor={getScoreBadgeColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InterviewCard({
  interview,
  onClick,
  formatDuration,
  getScoreBadgeColor,
}: {
  interview: any;
  onClick: () => void;
  formatDuration: (seconds: number) => string;
  getScoreBadgeColor: (score: number) => string;
}) {
  const feedback = useQuery(api.interview.getFeedbackByInterview, {
    interviewId: interview._id,
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-purple-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900 text-lg">
            Mock Interview Session
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(interview.completedAt || interview.startedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>

        {feedback && (
          <div className={`px-4 py-2 rounded-lg border font-bold ${getScoreBadgeColor(feedback.overallScore)}`}>
            {feedback.overallScore.toFixed(1)}/10
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(interview.duration || 0)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>{interview.questionsAsked} questions</span>
        </div>
        {feedback && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>{feedback.strengths.length} strengths</span>
          </div>
        )}
      </div>

      {/* Preview of strengths */}
      {feedback && feedback.strengths.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Top strengths:</p>
          <div className="flex flex-wrap gap-2">
            {feedback.strengths.slice(0, 3).map((strength: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200"
              >
                {strength}
              </span>
            ))}
            {feedback.strengths.length > 3 && (
              <span className="text-xs text-gray-500 px-3 py-1">
                +{feedback.strengths.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}