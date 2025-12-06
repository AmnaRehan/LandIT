import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4" />
      <p className="text-gray-600">Loading questions...</p>
    </div>
  );
};