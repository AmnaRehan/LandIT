"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import ResumeUploadSection from "../../components/resume/ResumeUploadSection";

export default function ResumePage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  // Queries
  const jobs = useQuery(
    api.jobDescriptions.getAllJobDescriptions,
    user ? { userId: user.id } : "skip"
  );

  


 const debugJobs = useQuery(api.jobDescriptions.debugGetAllJobs);

console.log("Current User ID:", user?.id);
console.log("ALL Jobs in Database:", debugJobs);
console.log("Jobs for this user:", jobs);

  const resumes = useQuery(
    api.resume.getResumesByJob,
    user ? { userId: user.id, jobDescriptionId: jobId || undefined } : "skip"
  );

  // Loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-gray-600">Please sign in to continue</div>
      </div>
    );
  }

  // No job selected - show job selector
  if (!jobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Select a Job Description
            </h1>
            <p className="text-gray-600 mb-6">
              Choose a job to analyze your resume against
            </p>

            {jobs && jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job: any) => (
                  <a
                    key={job._id}
                    href={`/resume?jobId=${job._id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {job.company && (
                      <p className="text-sm text-gray-600">{job.company}</p>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No job descriptions found
                </p>
                <a
                  href="/dashboard"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Create a job description first →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show upload section
  const selectedJob = jobs?.find((j) => j._id === jobId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600">
            Upload your resume for{" "}
            <span className="font-semibold text-purple-600">
              {selectedJob?.title || "this position"}
            </span>
          </p>
        </div>

        <ResumeUploadSection
          userId={user.id}
          jobDescriptionId={jobId}
          resumes={resumes || []}
        />
      </div>
    </div>
  );
}