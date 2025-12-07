// ============================================
// FILE PATH: src/components/interview/InterviewFeedback.tsx
// ============================================
// Create this NEW file - Feedback display screen

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowLeft, Trophy, AlertCircle, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface InterviewFeedbackProps {
  interviewId: string;
  onClose: () => void;
}

export default function InterviewFeedback({
  interviewId,
  onClose,
}: InterviewFeedbackProps) {
  const interview = useQuery(api.interview.getInterviewById, { interviewId });
  const feedback = useQuery(api.interview.getFeedbackByInterview, { interviewId });

  if (!feedback || !interview) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-gray-600">Loading feedback...</div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Interview feedback</span>
        </button>
        <p className="text-sm text-gray-500">
          {new Date(
            "completedAt" in interview && interview.completedAt
              ? interview.completedAt
              : interview._creationTime || Date.now()
          ).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </p>
      </div>

      {/* Overall Performance Card */}
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 mb-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Overall Performance</h2>
            </div>
            
            <div className="flex gap-8 text-sm">
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">
                  {formatDuration("duration" in interview && typeof interview.duration === "number" ? interview.duration : 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Questions</p>
                <p className="font-semibold text-gray-900">{("questions" in interview ? interview.questions : 0)}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className={`text-6xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore.toFixed(1)}
            </p>
            <p className="text-gray-600 mt-2">out of 10</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-gray-900">Areas to improve</h3>
          </div>
          <ul className="space-y-3">
            {feedback.areasToImprove.map((area, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6">Performance breakdown</h3>
        
        <div className="space-y-4">
          {Object.entries(feedback.performanceBreakdown).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
            
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{capitalizedLabel}</span>
                  <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                    {value}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(value)} transition-all duration-500`}
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
        <ul className="space-y-3">
          {feedback.nextSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
        >
          Start new interview
        </button>
      </div>
    </div>
  );
}