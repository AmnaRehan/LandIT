"use client"
import { useState } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from './../../convex/_generated/api';
import { extractTextFromFile, validateResumeFile } from '../lib/FileUtils';

interface UseResumeUploadProps {
  userId: string;
  jobDescriptionId: string;
  onSuccess?: (analysisId: string) => void;
  onError?: (error: string) => void;
}

export function useResumeUpload({
  userId,
  jobDescriptionId,
  onSuccess,
  onError,
}: UseResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const createResume = useMutation(api.resume.createResume);
  const analyzeResume = useAction(api.resume.analyzeResumeWithAI);

  const handleFileSelect = (selectedFile: File) => {
    const validation = validateResumeFile(selectedFile);

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress('Uploading file...');

    try {
      // Upload to Convex
      const uploadResult = await fetch('/api/upload', {
        method: 'POST',
        body: file,
      });

      if (!uploadResult.ok) throw new Error('Upload failed');

      const { storageId } = await uploadResult.json();
      // Create resume record
      setProgress('Creating resume record...');
      const resumeId = await createResume({
        userId,
        jobDescriptionId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storageId,
      });

      // Extract text
      setProgress('Extracting text...');
      const resumeText = await extractTextFromFile(file);

      // Analyze
      setProgress('Analyzing with AI...');
      const result = await analyzeResume({
        resumeId,
        resumeText,
        jobDescriptionId,
      });

      setProgress('Complete!');
      onSuccess?.(result.analysisId);
      
      // Reset after delay
      setTimeout(() => {
        reset();
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setProgress('');
  };

  return {
    file,
    loading,
    error,
    progress,
    handleFileSelect,
    uploadAndAnalyze,
    reset,
  };
}