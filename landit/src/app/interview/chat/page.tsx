'use client'

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { Id } from '../../../../convex/_generated/dataModel';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function HybridChatPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'Medium';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [interviewId, setInterviewId] = useState<Id<"interviews"> | null>(null);
  const [lastAIQuestion, setLastAIQuestion] = useState('');
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isListeningRef = useRef(false);

  // Convex mutations
  const startInterview = useMutation(api.interviews.startInterview);
  const answerQuestion = useMutation(api.interviews.answerQuestion);
  const skipQuestionMutation = useMutation(api.interviews.skipQuestion);
  const completeInterview = useMutation(api.interviews.completeInterview);
  
  const getUserByEmail = useQuery(
    api.users.getUserByEmail,
    user?.emailAddresses?.[0]?.emailAddress 
      ? { email: user.emailAddresses[0].emailAddress }
      : "skip"
  );

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcriptPiece + ' ';
            } else {
              interim += transcriptPiece;
            }
          }
          
          if (final) {
            setFinalTranscript(prev => prev + final);
            setInput(prev => prev + final);
          }
          
          setTranscript(finalTranscript + final + interim);
        };

        recognition.onend = () => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition restart failed:', e);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'no-speech') {
            return;
          }
          if (event.error !== 'aborted') {
            setIsListening(false);
            isListeningRef.current = false;
          }
        };

        recognitionRef.current = recognition;
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [finalTranscript]);

  // Initialize interview
  useEffect(() => {
    async function initInterview() {
      if (getUserByEmail && !interviewId) {
        try {
          const newInterviewId = await startInterview({
            userId: getUserByEmail._id,
            difficulty,
          });
          setInterviewId(newInterviewId);
        } catch (error) {
          console.error('Failed to create interview:', error);
        }
      }
    }

    initInterview();

    const initMessage = `Welcome to your ${difficulty} level interview! I'll be asking you questions to assess your skills. You can answer by typing or using the microphone. When you're ready to end the interview, just let me know. Let's start:\n\nCan you tell me about yourself and your experience with software development?`;
    
    if (messages.length === 0) {
      const msg: Message = {
        role: 'assistant',
        content: initMessage,
        timestamp: Date.now()
      };
      setMessages([msg]);
      setLastAIQuestion(initMessage);
      
      if (voiceMode) {
        speakText(initMessage);
      }
    }
  }, [difficulty, getUserByEmail, interviewId, startInterview, voiceMode]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text to Speech
  const speakText = (text: string) => {
    if (!synthRef.current || !voiceMode) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    synthRef.current.speak(utterance);
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (!voiceMode) {
      const lastAIMsg = messages.filter(m => m.role === 'assistant').pop();
      if (lastAIMsg) {
        speakText(lastAIMsg.content);
      }
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    }
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInput('');
      setFinalTranscript('');
      try {
        isListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Stop listening and send
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current.stop();
      
      setTimeout(() => {
        if (input.trim()) {
          sendMessage();
        }
      }, 300);
    }
  };

  // End interview manually
  const endInterview = async () => {
    if (!interviewId || isInterviewEnded) return;
    
    setIsInterviewEnded(true);
    setIsLoading(true);

    try {
      await completeInterview({ interviewId });
      
      const endMessage: Message = {
        role: 'assistant',
        content: 'Thank you for completing the interview! Redirecting you to the results page...',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, endMessage]);
      
      if (voiceMode) {
        speakText(endMessage.content);
      }

      setTimeout(() => {
        router.push('/interview/complete');
      }, 2000);
    } catch (error) {
      console.error('Error ending interview:', error);
      setIsInterviewEnded(false);
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading || !interviewId || isInterviewEnded) return;

    // Check if user wants to end interview
    const endKeywords = ['end interview', 'finish interview', 'stop interview', 'done', "i'm done", 'complete interview'];
    const wantsToEnd = endKeywords.some(keyword => 
      textToSend.toLowerCase().includes(keyword)
    );

    if (wantsToEnd) {
      await endInterview();
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTranscript('');
    setFinalTranscript('');
    setIsLoading(true);

    try {
      // Save answer
      await answerQuestion({
        interviewId,
        questionText: lastAIQuestion,
        answer: textToSend,
        questionOrder: currentQuestion,
      });

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          difficulty,
          currentQuestion,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setLastAIQuestion(data.message);
      
      if (voiceMode) {
        speakText(data.message);
      }
      
      setCurrentQuestion(prev => prev + 1);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const skipQuestion = async () => {
    if (!interviewId || isInterviewEnded) return;

    const skipMessage: Message = {
      role: 'user',
      content: '[Skipped]',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, skipMessage]);

    try {
      await skipQuestionMutation({
        interviewId,
        questionText: lastAIQuestion,
        questionOrder: currentQuestion,
      });

      const nextMessage: Message = {
        role: 'assistant',
        content: `Let's move to the next question. What interests you most about this position?`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, nextMessage]);
      setLastAIQuestion(nextMessage.content);
      if (voiceMode) speakText(nextMessage.content);
      setCurrentQuestion(prev => prev + 1);
    } catch (error) {
      console.error('Error skipping question:', error);
    }
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
          <span className="text-gray-600">
            Question {currentQuestion}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {difficulty}
          </span>
          {user && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
              {user.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          {/* Voice Mode Toggle */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b">
            <span className="text-sm text-gray-600">
              {voiceMode ? '🎤 Voice mode active' : '💬 Text mode'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={toggleVoiceMode}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  voiceMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {voiceMode ? '🔊 Voice On' : '🔇 Voice Off'}
              </button>
              <button
                onClick={endInterview}
                disabled={isInterviewEnded || isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
              >
                End Interview
              </button>
            </div>
          </div>

          {/* Live Transcript */}
          {isListening && transcript && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Listening:</strong> {transcript}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here... (or say 'end interview' when done)"
              className="flex-1 resize-none border-none focus:outline-none focus:ring-0 p-2 rounded-lg"
              disabled={isLoading || isListening || isInterviewEnded}
            />
            
            <div className="flex gap-2">
              {/* Microphone Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading || isInterviewEnded}
                className={`p-3 rounded-lg transition disabled:opacity-50 font-bold ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                title={isListening ? 'Stop recording' : 'Start recording'}
              >
                {isListening ? '⏹️' : '🎤'}
              </button>

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim() || isListening || isInterviewEnded}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Send
              </button>
              
              {/* Skip Button */}
              <button
                onClick={skipQuestion}
                disabled={isLoading || isInterviewEnded}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-medium"
              >
                Skip
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {isListening 
              ? '🔴 Recording... Click ⏹️ Stop when done speaking' 
              : 'Press Enter to send • Click 🎤 to speak • Say "end interview" or click End Interview button when done'}
          </p>
        </div>
      </div>
    </div>
  );
}