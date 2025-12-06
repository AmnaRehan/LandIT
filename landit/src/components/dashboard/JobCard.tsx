"use client";
import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface JobCardProps {
  title: string;
  icon: string;
  id: string; 
}

const jobLinks: Record<string, string> = {
  "1": "/questions",
  "2": "/interview",
  "3": "/resume",
  "4": "/job-description",
};

export const JobCard: React.FC<JobCardProps> = ({ title, icon, id }) => {
  // get link based on id, default to home
  const href = jobLinks[id]

  return (
    <Card className="flex flex-col items-center justify-between h-full min-h-[140px]">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-center text-sm text-gray-700 mb-4 flex-1">{title}</p>
      <Link href={href}>
        <Button className="h-5 w-15">
          <span className="mr-1">Start</span>
        </Button>
      </Link>
    </Card>
  );
};
