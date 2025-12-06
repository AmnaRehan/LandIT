import React from "react";

export const DashboardHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Making Landing{" "}
        <span className="inline-flex items-center justify-center border w-14 h-14 bg-purple-300 rounded-full text-2xl mx-2">
          IT
        </span>{" "}
        Easier
      </h1>
    </div>
  );
};