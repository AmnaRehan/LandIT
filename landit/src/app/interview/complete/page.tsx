'use client'

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSearchParams } from 'next/navigation';

export default function InterviewComplete() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  
  // Get the most recent completed interview
  const getUserByEmail = useQuery(
    api.users.getUserByEmail,
    user?.emailAddresses?.[0]?.emailAddress 
      ? { email: user.emailAddresses[0].emailAddress }
      : "skip"
  );

  const interviews = useQuery(
    api.interviews.getInterviewHistory,
    getUserByEmail ? { userId: getUserByEmail._id } : "skip"
  );

  // Get the most recent completed interview
  const latestInterview = interviews?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="LandIT Logo" 
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-800">LandIT</h1>
        </div>
        <div className="flex gap-4 items-center">
          {user && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
              {user.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      {/* Success Content */}
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 mt-20">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Interview Complete! 🎉
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Great job! You've completed your interview session. 
            Your responses have been recorded.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {latestInterview && (
              <a
                href={`/interview/feedback/${latestInterview._id}`}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                View Feedback
              </a>
            )}
            <a
              href="/interview"
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
            >
              Start Another Interview
            </a>
            <a
              href="/interview/history"
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              View History
            </a>
          </div>

          {/* Future: Add performance metrics here */}
        </div>
      </div>
    </div>
  );
}