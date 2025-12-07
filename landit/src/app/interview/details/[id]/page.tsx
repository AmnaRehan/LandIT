'use client'

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';

export default function InterviewDetails() {
  const { user } = useUser();
  const params = useParams();
  const interviewId = params.id as Id<"interviews">;
  
  const interview = useQuery(
    api.interviews.getInterviewDetails,
    interviewId ? { interviewId } : "skip"
  );

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

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
          <a href="/interview/history" className="px-4 py-2 text-gray-700 hover:text-purple-600">
            ← Back to History
          </a>
          {user && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
              {user.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-8">
        {/* View Feedback Button */}
        <div className="mb-6">
          <a
            href={`/interview/feedback/${interviewId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-md"
          >
            <span>📊</span>
            View AI Feedback
          </a>
        </div>

        {/* Interview Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {interview.difficulty || 'Medium'} Level Interview
              </h2>
              <p className="text-gray-600">
                {new Date(interview.startTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              interview.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {interview.status === 'completed' ? '✓ Completed' : 'In Progress'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-lg font-semibold text-gray-800">
                {interview.duration || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-lg font-semibold text-gray-800">
                {interview.questions?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Answered</p>
              <p className="text-lg font-semibold text-gray-800">
                {interview.questions?.filter(q => !q.skipped).length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Skipped</p>
              <p className="text-lg font-semibold text-gray-800">
                {interview.questions?.filter(q => q.skipped).length || 0}
              </p>
            </div>
          </div>

          {interview.jobInfo && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-2">Job Information</h3>
              <p className="text-gray-600"><strong>Title:</strong> {interview.jobInfo.title}</p>
              <p className="text-gray-600"><strong>Experience Level:</strong> {interview.jobInfo.experienceLevel}</p>
              {interview.jobInfo.description && (
                <p className="text-gray-600 mt-2"><strong>Description:</strong> {interview.jobInfo.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Questions & Answers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Questions & Answers</h3>
          
          {interview.questions && interview.questions.length > 0 ? (
            <div className="space-y-6">
              {interview.questions.map((question, index) => (
                <div key={question._id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-3">
                        {question.questionText}
                      </p>
                      
                      {question.skipped ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-700 text-sm font-medium">⚠️ Question Skipped</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-2 font-medium">Your Answer:</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{question.answer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No questions recorded for this interview.</p>
          )}
        </div>

        {interview.feedback && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Feedback</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{interview.feedback}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <a
            href={`/interview/feedback/${interviewId}`}
            className="flex-1 bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition text-center"
          >
            📊 View Detailed Feedback
          </a>
          <a
            href="/interview/history"
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-center"
          >
            ← Back to History
          </a>
        </div>
      </div>
    </div>
  );
}