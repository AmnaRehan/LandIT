// ============================================
// FILE PATH: src/components/interview/InterviewSession.tsx
// ============================================
// Fixed VAPI initialization - matches your .env.local

"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Mic, MicOff, Loader2 } from "lucide-react";
import InterviewFeedback from "./InterviewFeedback";

interface InterviewSessionProps {
  interviewId: string;
  userId: string;
  onComplete: () => void;
}

export default function InterviewSession({
  interviewId,
  userId,
  onComplete,
}: InterviewSessionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [duration, setDuration] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [vapiInitialized, setVapiInitialized] = useState(false);

  const startInterviewMutation = useMutation(api.interview.startInterview);
  const completeInterviewMutation = useMutation(api.interview.completeInterview);
  const generateFeedbackAction = useAction(api.interview.generateFeedback);
  const saveQuestionMutation = useMutation(api.interview.saveQuestion);

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<any>(null);

  // Initialize VAPI
  useEffect(() => {
    const initVapi = async () => {
      try {
        // Dynamically import Vapi
        const Vapi = (await import("@vapi-ai/web")).default;
        
        // Use the correct env variable name from your .env.local
        const vapiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        if (!vapiKey) {
          console.error("VAPI API key not found. Please check your .env.local file.");
          throw new Error("VAPI key not configured");
        }

        console.log("Initializing VAPI with key:", vapiKey.substring(0, 8) + "...");
        vapiRef.current = new Vapi(vapiKey);
        
        // Set up event listeners
        vapiRef.current.on("call-start", () => {
          console.log("Call started");
          setIsRecording(true);
          startInterviewMutation({ interviewId });
          
          // Start duration timer
          durationIntervalRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
          }, 1000);
        });

        vapiRef.current.on("call-end", async () => {
          console.log("Call ended");
          setIsRecording(false);
          
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
          }

          // Complete interview
          await completeInterviewMutation({
            interviewId,
            duration,
            questionsAsked,
          });

          // Generate feedback
          setIsGeneratingFeedback(true);
          try {
            await generateFeedbackAction({ interviewId });
            setShowFeedback(true);
          } catch (error) {
            console.error("Failed to generate feedback:", error);
            alert("Failed to generate feedback. Please try again.");
          } finally {
            setIsGeneratingFeedback(false);
          }
        });

        vapiRef.current.on("speech-start", () => {
          console.log("Assistant started speaking");
        });

        vapiRef.current.on("speech-end", () => {
          console.log("Assistant stopped speaking");
        });

        vapiRef.current.on("message", (message: any) => {
          console.log("Message:", message);
          
          if (message.type === "transcript" && message.role === "assistant") {
            setCurrentMessage(message.transcript);
            setQuestionsAsked((prev) => prev + 1);
          }

          if (message.type === "transcript" && message.role === "user") {
            // Save Q&A pair
            saveQuestionMutation({
              interviewId,
              questionNumber: questionsAsked + 1,
              question: currentMessage,
              userAnswer: message.transcript,
            });
          }
        });

        setVapiInitialized(true);
        console.log("VAPI initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Vapi:", error);
        alert("Failed to initialize interview system. Please refresh and try again.");
      }
    };

    initVapi();

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    if (!vapiRef.current || !vapiInitialized) {
      alert("Interview system not ready. Please wait a moment.");
      return;
    }

    // FIXED: Use WORKFLOW_ID instead of ASSISTANT_ID
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      alert("VAPI workflow not configured. Please check your environment variables.");
      return;
    }

    try {
      console.log("Starting call with workflow:", workflowId);
      // Start with workflow ID instead of assistant ID
      await vapiRef.current.start(workflowId);
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Failed to start interview. Please try again.");
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (showFeedback) {
    return <InterviewFeedback interviewId={interviewId} onClose={onComplete} />;
  }

  if (isGeneratingFeedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
        <p className="text-xl text-gray-700">Analyzing your performance...</p>
        <p className="text-sm text-gray-500">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Message Display */}
      {currentMessage && (
        <div className="mb-8 max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <p className="text-gray-800 text-lg leading-relaxed">{currentMessage}</p>
          </div>
        </div>
      )}

      {/* Recording Indicator & Timer */}
      {isRecording && (
        <div className="mb-6 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-gray-700 font-medium">Recording</span>
          </div>
          <div className="text-gray-600 font-mono">{formatDuration(duration)}</div>
          <div className="text-gray-600">
            {questionsAsked} question{questionsAsked !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Microphone Button */}
      <button
        onClick={isRecording ? endCall : startCall}
        disabled={!vapiInitialized}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-purple-600 hover:bg-purple-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isRecording ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>

      {/* Status Text */}
      <p className="mt-6 text-gray-600 font-medium">
        {!vapiInitialized
          ? "Initializing interview system..."
          : isRecording
          ? "Click to end interview"
          : "Click to start speaking"}
      </p>

      {/* Instructions */}
      {!isRecording && (
        <div className="mt-8 max-w-md text-center space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-700">Interview Guidelines:</p>
          <ul className="space-y-1">
            <li>• Answer each question clearly and concisely</li>
            <li>• Take your time to think before responding</li>
            <li>• Provide specific examples when possible</li>
            <li>• The AI will ask 3-5 questions</li>
          </ul>
        </div>
      )}
    </div>
  );
}