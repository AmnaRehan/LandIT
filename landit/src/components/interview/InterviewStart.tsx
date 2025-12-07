// ============================================
// FILE PATH: src/components/interview/InterviewStart.tsx
// ============================================
// Create this NEW file - Start interview screen

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Video, History } from "lucide-react";

interface InterviewStartProps {
  userId: string;
  onStartInterview: (interviewId: string) => void;
  onShowHistory: () => void;
  hasHistory: boolean;
}

export default function InterviewStart({
  userId,
  onStartInterview,
  onShowHistory,
  hasHistory,
}: InterviewStartProps) {
  const [loading, setLoading] = useState(false);
  const createInterview = useMutation(api.interview.createInterview);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const interviewId = await createInterview({ userId });
      onStartInterview(interviewId);
    } catch (error) {
      console.error("Failed to create interview:", error);
      alert("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Video Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center shadow-xl">
          <Video className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartInterview}
        disabled={loading}
        className="bg-gray-900 text-white px-12 py-4 rounded-xl text-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? "Starting..." : "Start interview"}
      </button>

      {/* History Button */}
      {hasHistory && (
        <button
          onClick={onShowHistory}
          className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          <History className="w-4 h-4" />
          view interview history
        </button>
      )}

      {/* Tips */}
      <div className="mt-12 max-w-md text-center space-y-3 text-sm text-gray-600">
        <p className="font-medium text-gray-700">Tips for a great interview:</p>
        <ul className="space-y-2">
          <li>✓ Find a quiet place with good lighting</li>
          <li>✓ Test your microphone before starting</li>
          <li>✓ Speak clearly and at a moderate pace</li>
          <li>✓ Use the STAR method for behavioral questions</li>
        </ul>
      </div>
    </div>
  );
}