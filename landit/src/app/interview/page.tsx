// ============================================
// FILE PATH: src/app/interview/page.tsx
// ============================================
// Create this NEW file - Main interview page

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import InterviewStart from "@/components/interview/InterviewStart";
import InterviewSession from "@/components/interview/InterviewSession";
import InterviewHistory from "@/components/interview/InterviewHistory";

export default function InterviewPage() {
  const { user } = useUser();
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const interviewHistory = useQuery(
    api.interview.getInterviewHistory,
    user ? { userId: user.id } : "skip"
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-gray-600">Please sign in to access interviews</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeInterviewId ? (
          <InterviewSession
            interviewId={activeInterviewId}
            userId={user.id}
            onComplete={() => setActiveInterviewId(null)}
          />
        ) : showHistory ? (
          <InterviewHistory
            history={interviewHistory || []}
            onBack={() => setShowHistory(false)}
          />
        ) : (
          <InterviewStart
            userId={user.id}
            onStartInterview={setActiveInterviewId}
            onShowHistory={() => setShowHistory(true)}
            hasHistory={(interviewHistory?.length || 0) > 0}
          />
        )}
      </main>
    </div>
  );
}