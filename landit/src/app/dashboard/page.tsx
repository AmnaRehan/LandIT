"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


import { DashboardHeader } from "@/components/dashboard/DashBoardHeader";
import { SoftwareJobSection } from "@/components/dashboard/SoftwareJobSection";
import { ActivitySection } from "@/components/dashboard/ActivitySection";

export default function DashboardPage() {
  // cast to Convex Id type
  const userId = "123"

  // Fetch from Convex queries
  const activity = useQuery(api.dashboard.getActivityData, { userId });
  const jobInfo = useQuery(api.dashboard.getJobInfo, { userId });

  // Ensure numbers are always valid for charts
  const questions = activity?.questions ?? 0;
  const correct = activity?.correct ?? 0;
  const incorrect = activity?.incorrect ?? 0;

  const barData = {
    questions,
    correct,
    incorrect,
  };

  const pieData = {
    questionsAttempted: questions,
    interviewsTaken: correct,
    resumeUploaded: incorrect,
  };

  // Guard against total = 0 to avoid NaN in Recharts
  const safePieData =
    pieData.questionsAttempted + pieData.interviewsTaken + pieData.resumeUploaded > 0
      ? pieData
      : { questionsAttempted: 1, interviewsTaken: 1, resumeUploaded: 1 };

  return (
    <div className="min-h-screen bg-purple-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SoftwareJobSection
            jobTitle={jobInfo?.title ?? "Software Engineering Job"}
          />

          <ActivitySection barData={barData} pieData={safePieData} />
        </div>
      </div>
    </div>
  );
}
