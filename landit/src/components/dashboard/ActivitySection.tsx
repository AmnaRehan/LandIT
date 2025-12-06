"use client";
import React from "react";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";

interface ActivitySectionProps {
  barData: { questions: number; correct: number; incorrect: number };
  pieData: { questionsAttempted: number; interviewsTaken: number; resumeUploaded: number };
}


export const ActivitySection: React.FC<ActivitySectionProps> = ({ barData, pieData }) => {
  return (
    <div className="bg-gradient-to-br from-cyan-200 to-purple-300 rounded-3xl p-6">
      <h2 className="text-lg font-semibold mb-4">Activity</h2>
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">2024</span>
          <span className="text-xs text-gray-600">100</span>
        </div>
        <div className="w-full h-[250px]">
         <BarChart data={barData} />
        </div>
      </div>
      <div className="flex justify-center">
        <PieChart data={pieData} />
      </div>
    </div>
  );
};