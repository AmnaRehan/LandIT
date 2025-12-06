"use client";
import React from "react";
import { JobCard } from "./JobCard";

const jobActions = [
  { id: "1", title: "Challenge yourself with questions", icon: "📝" },
  { id: "2", title: "Simulate a real-time live interview with AI", icon: "🎯" },
  { id: "3", title: "Get feedback and improve resume", icon: "📄" },
  { id: "4", title: "Update job description", icon: "📋" },
];

export const SoftwareJobSection: React.FC = () => {
  return (
    <div className="bg-orange-200 rounded-3xl p-6">
      <h2 className="text-lg font-semibold mb-4">Software Engineering Job</h2>
      <div className="grid grid-cols-2 gap-4">
        {jobActions.map((action) => (
          <JobCard
            key={action.id}
            id={action.id}        // ✅ pass id for linking
            title={action.title}
            icon={action.icon}
          />
        ))}
      </div>
    </div>
  );
};
