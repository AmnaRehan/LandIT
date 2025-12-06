import React from "react";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Job Descriptions Yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create your first job description to start generating relevant interview
        questions and practice materials.
      </p>
      <button
        onClick={onCreateClick}
        className="px-6 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors"
      >
        + Create Job Description
      </button>
    </div>
  );
};
