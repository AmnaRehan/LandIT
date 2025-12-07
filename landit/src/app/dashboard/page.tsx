"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

import { DashboardHeader } from "@/components/dashboard/DashBoardHeader";
import { SoftwareJobSection } from "@/components/dashboard/SoftwareJobSection";
import { ActivitySection } from "@/components/dashboard/ActivitySection";

export default function DashboardPage() {
  const { user } = useUser();
  const userId = user?.id;

  // Avoid calling Convex until user is ready
  const activity = useQuery(
    api.dashboard.getActivityData,
    userId ? { userId } : "skip"
  );

  const jobInfo = useQuery(
    api.dashboard.getJobInfo,
    userId ? { userId } : "skip"
  );

  const questions = activity?.questions ?? 0;
  const correct = activity?.correct ?? 0;
  const incorrect = activity?.incorrect ?? 0;

  const barData = { questions, correct, incorrect };

  const pieData = {
    questionsAttempted: questions,
    interviewsTaken: correct,
    resumeUploaded: incorrect,
  };

  const safePieData =
    questions + correct + incorrect > 0
      ? pieData
      : { questionsAttempted: 1, interviewsTaken: 1, resumeUploaded: 1 };

  return (
    <div className="min-h-screen bg-purple-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SoftwareJobSection  />
          <ActivitySection barData={barData} pieData={safePieData} />
        </div>
      </div>
    </div>
  );
}
