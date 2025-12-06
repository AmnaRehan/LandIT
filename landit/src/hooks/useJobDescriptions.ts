import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export function useJobDescriptions(userId: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Queries
  const allJobDescriptions = useQuery(api.jobDescriptions.getAllJobDescriptions, {
    userId,
  });
  const activeJobDescription = useQuery(api.jobDescriptions.getActiveJobDescription, {
    userId,
  });

  // Mutations
  const createJobDescription = useMutation(api.jobDescriptions.createJobDescription);
  const updateJobDescription = useMutation(api.jobDescriptions.updateJobDescription);
  const deleteJobDescription = useMutation(api.jobDescriptions.deleteJobDescription);
  const setActiveJobDescription = useMutation(
    api.jobDescriptions.setActiveJobDescription
  );

  // Actions
  const generateWithAI = useAction(api.jobDescriptions.generateJobDescriptionWithAI);

  const handleGenerateWithAI = async (
    jobTitle: string,
    company?: string,
    additionalInfo?: string
  ) => {
    setIsGenerating(true);
    try {
      const generated = await generateWithAI({ jobTitle, company, additionalInfo });
      return generated;
    } catch (error) {
      console.error("Error generating job description:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateJobDescription = async (data: any) => {
    try {
      const id = await createJobDescription({ userId, ...data });
      return id;
    } catch (error) {
      console.error("Error creating job description:", error);
      throw error;
    }
  };

  const handleDeleteJobDescription = async (id: Id<"jobDescriptions">) => {
    try {
      await deleteJobDescription({ id });
    } catch (error) {
      console.error("Error deleting job description:", error);
      throw error;
    }
  };

  const handleSetActive = async (id: Id<"jobDescriptions">) => {
    try {
      await setActiveJobDescription({ userId, id });
    } catch (error) {
      console.error("Error setting active job description:", error);
      throw error;
    }
  };

  return {
    allJobDescriptions: allJobDescriptions || [],
    activeJobDescription,
    isGenerating,
    createJobDescription: handleCreateJobDescription,
    updateJobDescription,
    deleteJobDescription: handleDeleteJobDescription,
    setActiveJobDescription: handleSetActive,
    generateWithAI: handleGenerateWithAI,
  };
}