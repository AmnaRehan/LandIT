'use client'

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function InterviewHistory() {
  const { user } = useUser();
  
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
          <a href="/interview" className="px-4 py-2 text-gray-700 hover:text-purple-600">
            Back to Interview
          </a>
          {user && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
              {user.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Interview History</h2>
        
        {!interviews ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Loading your interview history...</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Your interview history will appear here once you complete interviews.
            </p>
            <p className="text-gray-500 mt-4">
              No interviews completed yet. Start your first interview!
            </p>
            <a 
              href="/interview"
              className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Start Interview
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div 
                key={interview._id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => window.location.href = `/interview/details/${interview._id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {interview.difficulty || 'Medium'} Level Interview
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(interview.startTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {interview.duration && (
                      <p className="text-sm text-gray-600 mt-1">
                        Duration: {interview.duration}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    interview.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {interview.status === 'completed' ? '✓ Completed' : 'In Progress'}
                  </span>
                </div>

                {interview.jobInfo && (
                  <div className="border-t pt-3 mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Job:</strong> {interview.jobInfo.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Experience Level:</strong> {interview.jobInfo.experienceLevel}
                    </p>
                  </div>
                )}

                <div className="text-purple-600 text-sm font-medium mt-4">
                  Click to view details →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}