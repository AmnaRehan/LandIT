"use client";
import React from "react";

interface BarChartProps {
  data: {
    questions: number;
    correct: number;
    incorrect: number;
  };
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue =
    Math.max(data.questions, data.correct, data.incorrect) || 1;

  const scale = (100 / maxValue);
  

 return (
  <div className="w-full h-48 flex items-end justify-center gap-8 px-8">
      <div className="flex flex-col items-center gap-2">
    <div style={{ height: '160px' }} className="flex items-end">
  <div
    className="w-16 bg-purple-500 rounded-t-lg transition-all min-h-[4px]"
    style={{ height: `${(data.questions / maxValue) * 100}%` }}
  />
</div>
        <span className="text-xs text-gray-600">Questions</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div style={{ height: '160px' }} className="flex items-end">
  <div
    className="w-16 bg-purple-500 rounded-t-lg transition-all min-h-[4px]"
    style={{ height: `${(data.correct / maxValue) * 100}%` }}
  />
</div>
        <span className="text-xs text-gray-600">Correct</span>
      </div>

      <div className="flex flex-col items-center gap-2">
       <div style={{ height: '160px' }} className="flex items-end">
  <div
    className="w-16 bg-purple-500 rounded-t-lg transition-all min-h-[4px]"
    style={{ height: `${(data.incorrect / maxValue) * 100}%` }}
  />
</div>
        <span className="text-xs text-gray-600">Incorrect</span>
      </div>
    </div>
  );
};
