import React from "react";
import { Difficulty } from "@/types/questions";

interface DifficultySelectorProps {
  selected: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selected,
  onChange,
}) => {
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  const getButtonClass = (diff: Difficulty) => {
    const baseClass = "px-6 py-2 rounded-full font-medium transition-all text-sm";
    const colors = {
      easy: "bg-green-400 hover:bg-green-500 text-white",
      medium: "bg-yellow-400 hover:bg-yellow-500 text-white",
      hard: "bg-red-400 hover:bg-red-500 text-white",
    };

    return `${baseClass} ${
      selected === diff ? colors[diff] : "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }`;
  };

  return (
    <div className="flex gap-3 justify-center mb-8">
      {difficulties.map((diff) => (
        <button
          key={diff}
          onClick={() => onChange(diff)}
          className={getButtonClass(diff)}
        >
          {diff.charAt(0).toUpperCase() + diff.slice(1)}
        </button>
      ))}
    </div>
  );
};