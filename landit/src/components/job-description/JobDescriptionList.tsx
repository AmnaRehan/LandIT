"use client";
import React from "react";
import { JobDescription } from "@/types/job-description";
import { JobDescriptionCard } from "./JobDescriptionCard";
import { Id } from "../../../convex/_generated/dataModel";

interface JobDescriptionListProps {
  jobDescriptions: JobDescription[];
  activeJobId?: string;
  onSetActive: (id: Id<"jobDescriptions">) => void;
  onDelete: (id: Id<"jobDescriptions">) => void;
}

export const JobDescriptionList: React.FC<JobDescriptionListProps> = ({
  jobDescriptions,
  activeJobId,
  onSetActive,
  onDelete,
}) => {
  if (jobDescriptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Your Job Descriptions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobDescriptions.map((job) => (
          <JobDescriptionCard
            key={job._id}
            jobDescription={job}
            isActive={job._id === activeJobId}
            onSetActive={onSetActive}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};