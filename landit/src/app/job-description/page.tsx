"use client";
import React, { useState } from "react";
import { useJobDescriptions } from "@/hooks/useJobDescriptions";
import { JobDescriptionForm } from "@/components/job-description/JobDescriptionForm";
import { JobDescriptionList } from "@/components/job-description/JobDescriptionList";
import { EmptyState } from "@/components/job-description/EmptyState";
import { Button } from "@/components/ui/Button";
import { JobDescriptionFormData } from "@/types/job-description";
import { useUser } from "@clerk/nextjs";

export default function JobDescriptionPage() {
  const { user } = useUser();
  const userId = user?.id ?? ""; // Replace with actual auth
  const [showForm, setShowForm] = useState(false);

  const {
    allJobDescriptions,
    activeJobDescription,
    createJobDescription,
    deleteJobDescription,
    setActiveJobDescription,
    generateWithAI,
  } = useJobDescriptions(userId);

  const handleCreateJob = async (data: JobDescriptionFormData) => {
    try {
      await createJobDescription(data);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create job description:", error);
      alert("Failed to create job description. Please try again.");
    }
  };

  const handleGenerateWithAI = async (data: {
    jobTitle: string;
    company?: string;
    additionalInfo?: string;
  }) => {
    try {
      return await generateWithAI(data.jobTitle, data.company, data.additionalInfo);
    } catch (error) {
      console.error("Failed to generate with AI:", error);
      alert("Failed to generate job description. Please try again.");
      throw error;
    }
  };

  const handleDeleteJob = async (id: any) => {
    try {
      await deleteJobDescription(id);
    } catch (error) {
      console.error("Failed to delete job description:", error);
      alert("Failed to delete job description. Please try again.");
    }
  };

  const handleSetActive = async (id: any) => {
    try {
      await setActiveJobDescription(id);
    } catch (error) {
      console.error("Failed to set active job description:", error);
      alert("Failed to set active job description. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 text-gray-700 mb-4 hover:text-gray-900 transition-colors"
          >
            <span>←</span> Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Job Descriptions
              </h1>
              <p className="text-gray-600">
                Manage your target job positions for interview preparation
              </p>
            </div>
            {allJobDescriptions.length > 0 && !showForm && (
              <Button onClick={() => setShowForm(true)}>
                + New Job Description
              </Button>
            )}
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8">
            <JobDescriptionForm
              onSubmit={handleCreateJob}
              onCancel={() => setShowForm(false)}
              onAIGenerate={handleGenerateWithAI}
            />
          </div>
        )}

        {/* Empty State */}
        {allJobDescriptions.length === 0 && !showForm && (
          <EmptyState onCreateClick={() => setShowForm(true)} />
        )}

        {/* Job Descriptions List */}
        {allJobDescriptions.length > 0 && !showForm && (
          <JobDescriptionList
            jobDescriptions={allJobDescriptions.map(jd => ({
              ...jd,
              experienceLevel: (["entry", "mid", "senior", "lead"].includes(jd.experienceLevel)
                ? jd.experienceLevel
                : "entry") as "entry" | "mid" | "senior" | "lead",
              jobType: (["full-time", "part-time", "contract", "internship"].includes(jd.jobType)
                ? jd.jobType
                : "full-time") as "full-time" | "part-time" | "contract" | "internship"
            }))}
            activeJobId={activeJobDescription?._id}
            onSetActive={handleSetActive}
            onDelete={handleDeleteJob}
          />
        )}

        {/* Footer Stats */}
        {allJobDescriptions.length > 0 && !showForm && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Total: {allJobDescriptions.length} job description
            {allJobDescriptions.length !== 1 ? "s" : ""} •{" "}
            {activeJobDescription ? (
              <span className="text-purple-600 font-medium">
                Active: {activeJobDescription.title}
              </span>
            ) : (
              <span className="text-orange-600">No active job selected</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}