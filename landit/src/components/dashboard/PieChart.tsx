"use client";
import React from "react";

interface PieChartProps {
  data: {
    questionsAttempted: number;
    interviewsTaken: number;
    resumeUploaded: number;
  };
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.questionsAttempted + data.interviewsTaken + data.resumeUploaded;
  const percentages = {
    questions: (data.questionsAttempted / total) * 100,
    interviews: (data.interviewsTaken / total) * 100,
    resume: (data.resumeUploaded / total) * 100,
  };

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="20"
            strokeDasharray={`${percentages.questions * 2.51} 251`}
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#FB923C"
            strokeWidth="20"
            strokeDasharray={`${percentages.interviews * 2.51} 251`}
            strokeDashoffset={-percentages.questions * 2.51}
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#67E8F9"
            strokeWidth="20"
            strokeDasharray={`${percentages.resume * 2.51} 251`}
            strokeDashoffset={-(percentages.questions + percentages.interviews) * 2.51}
          />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-400" />
          <span className="text-xs text-gray-600">Questions Attempted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <span className="text-xs text-gray-600">Interviews taken</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-300" />
          <span className="text-xs text-gray-600">Resume Uploaded</span>
        </div>
      </div>
    </div>
  );
};