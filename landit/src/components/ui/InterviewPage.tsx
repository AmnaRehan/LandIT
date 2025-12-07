'use client'

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';

export default function InterviewPage() {
  const { user } = useUser();
  const [currentUserId, setCurrentUserId] = useState<Id<"users"> | null>(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  
  // Get or create user
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const getUserByEmail = useQuery(
    api.users.getUserByEmail,
    user?.emailAddresses?.[0]?.emailAddress 
      ? { email: user.emailAddresses[0].emailAddress }
      : "skip"
  );

  // Set up user when component loads
  useEffect(() => {
    async function setupUser() {
      if (user?.emailAddresses?.[0]?.emailAddress && !currentUserId) {
        try {
          const userId = await getOrCreateUser({
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName || undefined,
            imageUrl: user.imageUrl || undefined,
          });
          setCurrentUserId(userId);
        } catch (error) {
          console.error('Failed to setup user:', error);
        }
      }
    }
    
    if (getUserByEmail) {
      setCurrentUserId(getUserByEmail._id);
    } else {
      setupUser();
    }
  }, [user, getUserByEmail, currentUserId, getOrCreateUser]);

  const handleStartInterview = () => {
    if (!currentUserId) {
      alert('Please log in first');
      return;
    }
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = (difficulty: string) => {
    setShowDifficultyModal(false);
    // Navigate directly to hybrid chat (text + voice)
    window.location.href = `/interview/chat?difficulty=${difficulty}`;
  };

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
          <a href="/interview" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium">
            Interview
          </a>
          <a href="/questions" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium">
            Questions
          </a>
          <a href="/resume" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium">
            Resume
          </a>
          <a href="/dashboard" className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium">
            Dashboard
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
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-black text-white rounded-full p-8 mb-8">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <button 
            onClick={handleStartInterview}
            disabled={!currentUserId}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start interview
          </button>
          <a href="/interview/history" className="text-gray-700 underline hover:text-purple-600">
            view interview history
          </a>
        </div>

        {/* Difficulty Selection Modal */}
        {showDifficultyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-6">Select Difficulty Level</h3>
              <div className="space-y-3">
                {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultySelect(difficulty)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left"
                  >
                    <p className="font-semibold text-lg">{difficulty}</p>
                    <p className="text-sm text-gray-600">
                      {difficulty === 'Easy' && 'Basic questions for beginners'}
                      {difficulty === 'Medium' && 'Intermediate level questions'}
                      {difficulty === 'Hard' && 'Advanced technical questions'}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDifficultyModal(false)}
                className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}