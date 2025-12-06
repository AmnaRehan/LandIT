"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JobDescription } from "@/types/job-description";
import { Id } from "../../../convex/_generated/dataModel";

interface JobDescriptionCardProps {
  jobDescription: JobDescription;
  isActive: boolean;
  onSetActive: (id: Id<"jobDescriptions">) => void;
  onDelete: (id: Id<"jobDescriptions">) => void;
}

export const JobDescriptionCard: React.FC<JobDescriptionCardProps> = ({
  jobDescription,
  isActive,
  onSetActive,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Card className={isActive ? "border-4 border-purple-500" : ""}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                {jobDescription.title}
              </h3>
              {isActive && (
                <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </div>
            {jobDescription.company && (
              <p className="text-gray-600">{jobDescription.company}</p>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {jobDescription.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Job Type</span>
            <p className="text-sm font-medium capitalize">
              {jobDescription.jobType.replace("-", " ")}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-xs text-gray-500 block mb-2">Skills</span>
          <div className="flex flex-wrap gap-1">
            {jobDescription.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
            {jobDescription.skills.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{jobDescription.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!isActive && (
            <Button
              onClick={() => onSetActive(jobDescription._id as Id<"jobDescriptions">)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              Set as Active
            </Button>
          )}
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="secondary"
            size="sm"
            className="bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete
          </Button>
        </div>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">Delete Job Description?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All associated questions will remain but
              won't be linked to this job description.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onDelete(jobDescription._id as Id<"jobDescriptions">);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};