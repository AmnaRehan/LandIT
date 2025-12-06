"use client";
import React, { useState, KeyboardEvent } from "react";

interface RequirementInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
}

export const RequirementInput: React.FC<RequirementInputProps> = ({
  items,
  onChange,
  placeholder = "Add item and press Enter",
  label = "Items",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onChange([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none mb-3"
      />
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
          >
            <span>{item}</span>
            <button
              onClick={() => removeItem(index)}
              className="hover:text-purple-900 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};