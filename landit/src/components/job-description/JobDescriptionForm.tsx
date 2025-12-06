"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RequirementInput } from "./RequirementInput";
import { AIGenerateButton } from "./AIGenerateButton";
import {
  JobDescriptionFormData,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
} from "@/types/job-description";

interface JobDescriptionFormProps {
  onSubmit: (data: JobDescriptionFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<JobDescriptionFormData>;
  isEditing?: boolean;
  onAIGenerate: (data: any) => Promise<any>;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  onAIGenerate,
}) => {
  const [formData, setFormData] = useState<JobDescriptionFormData>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || [],
    skills: initialData?.skills || [],
    experienceLevel: initialData?.experienceLevel || "mid",
    jobType: initialData?.jobType || "full-time",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIResult = (result: any) => {
    setFormData((prev) => ({
      ...prev,
      description: result.description || prev.description,
      requirements: result.requirements || prev.requirements,
      skills: result.skills || prev.skills,
      experienceLevel: result.experienceLevel || prev.experienceLevel,
      jobType: result.jobType || prev.jobType,
    }));
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Job Description" : "Create Job Description"}
        </h2>

        {!isEditing && (
          <AIGenerateButton onGenerate={onAIGenerate} onResult={handleAIResult} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Senior Full Stack Developer"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g., Google"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={6}
            placeholder="Describe the role, responsibilities, and what you'll be working on..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>

        <RequirementInput
          items={formData.requirements}
          onChange={(requirements) => setFormData({ ...formData, requirements })}
          label="Requirements"
          placeholder="Add requirement and press Enter"
        />

        <RequirementInput
          items={formData.skills}
          onChange={(skills) => setFormData({ ...formData, skills })}
          label="Technical Skills"
          placeholder="Add skill and press Enter"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experienceLevel: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value as any })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {JOB_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., Remote, San Francisco, CA"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="e.g., $120k - $180k"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Card>
  );
};