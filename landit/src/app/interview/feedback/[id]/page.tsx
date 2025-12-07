'use client'

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';

export default function InterviewFeedback() {
  const { user } = useUser();
  const params = useParams();
  const interviewId = params.id as Id<"interviews">;
  
  const interview = useQuery(
    api.interviews.getInterviewDetails,
    interviewId ? { interviewId } : "skip"
  );

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalQuestions = interview.questions?.length || 0;
  const answeredQuestions = interview.questions?.filter(q => !q.skipped).length || 0;
  const skippedQuestions = interview.questions?.filter(q => q.skipped).length || 0;
  const overallScore = totalQuestions > 0 ? ((answeredQuestions / totalQuestions) * 10).toFixed(1) : '0';

  // Mock performance breakdown (you can enhance this with actual AI analysis)
  const performanceMetrics = [
    { name: 'Technical Knowledge', score: 9, max: 10, color: 'bg-green-500' },
    { name: 'Problem Solving', score: 8, max: 10, color: 'bg-blue-500' },
    { name: 'Confidence Level', score: 6.5, max: 10, color: 'bg-purple-500' },
    { name: 'Answer Structure', score: 9.5, max: 10, color: 'bg-indigo-500' },
  ];

  const strengths = [
    'Clear and concise communication style',
    'Demonstrated relevant experience effectively',
    'Good enthusiasm and positive attitude',
    'Structured responses with examples',
  ];

  const areasToImprove = [
    'Provide more specific metrics in examples',
    'Elaborate on technical implementation details',
    'Reduce filler words and pauses',
    'Connect answers to job requirements',
  ];

  const nextSteps = [
    'Practice answering with specific metrics and data points',
    'Review common behavioral questions and prepare STAR method responses',
    'Schedule another practice session to improve technical responses',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
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
          <a href="/interview" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium">
            Interview
          </a>
          <a href="/questions" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium">
            Questions
          </a>
          <a href="/resume" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium">
            Resume
          </a>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">
            Dashboard
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            🌙
          </button>
          {user && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
              {user.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Interview feedback</h2>
          <p className="text-gray-600">
            {new Date(interview.startTime).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Overall Performance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🏆</span>
            <h3 className="text-xl font-bold text-gray-800">Overall Performance</h3>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-semibold text-gray-800">{interview.duration || '00:00:14'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Questions</p>
                <p className="text-lg font-semibold text-gray-800">{answeredQuestions}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center mb-2">
                <div className="text-5xl font-bold text-gray-800">{overallScore}</div>
              </div>
              <p className="text-sm text-gray-600">out of 10</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🟢</span>
              <h3 className="text-lg font-bold text-gray-800">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔴</span>
              <h3 className="text-lg font-bold text-gray-800">Areas to improve</h3>
            </div>
            <ul className="space-y-3">
              {areasToImprove.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">⚠</span>
                  <span className="text-sm text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Performance breakdown</h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  <span className="text-sm font-semibold text-gray-800">{metric.score}/{metric.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${metric.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${(metric.score / metric.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Next Steps</h3>
          <ul className="space-y-3 mb-6">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => window.location.href = '/interview'}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition"
          >
            Start Interview
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = `/interview/details/${interviewId}`}
            className="flex-1 bg-white border-2 border-purple-600 text-purple-600 font-medium py-3 rounded-xl hover:bg-purple-50 transition"
          >
            View Full Transcript
          </button>
          <button 
            onClick={() => window.location.href = '/interview/history'}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Back to History
          </button>
        </div>
      </div>
    </div>
  );
}