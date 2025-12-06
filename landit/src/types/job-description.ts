export interface JobDescription {
  _id?: string;
  userId: string;
  title: string;
  company?: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  jobType: "full-time" | "part-time" | "contract" | "internship";
  location?: string;
  salary?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface JobDescriptionFormData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  jobType: "full-time" | "part-time" | "contract" | "internship";
  location: string;
  salary: string;
}

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead/Principal" },
] as const;

export const JOB_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const;
