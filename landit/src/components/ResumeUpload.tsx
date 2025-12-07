"use client"
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useResumeUpload } from '@/hooks/useResumeUpload';
import { formatFileSize } from '@/lib/FileUtils';
import { PageHeader } from '@/components/resume/PageHeader';
import { FileDropzone } from '@/components/resume/FileDropzone';
import { StatusAlert } from '@/components/resume/StatusAlert';
import { ActionButtons } from '@/components/resume/ActionButtons';
import { ResumeList } from '@/components/resume/ResumeList';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function ResumeUploadPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const jobDescriptionId = searchParams.get('jobId');
  
  const jobDescriptions = useQuery(
    api.jobDescriptions.getAllJobDescriptions, 
    user ? { userId: user.id } : "skip"
  );
  
  // Always pass arguments, but jobDescriptionId can be undefined/null
  const resumes = useQuery(
    api.resume.getResumesByJob, 
    user 
      ? { userId: user.id, jobDescriptionId: jobDescriptionId || '' } 
      : "skip"
  );
  
  const { file, loading, error, progress, handleFileSelect, uploadAndAnalyze, reset } = 
    useResumeUpload({ 
      userId: user?.id || '', 
      jobDescriptionId: jobDescriptionId || '',
      onSuccess: (id) => console.log('Analysis complete:', id),
    });

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Please sign in to continue</div>
      </div>
    );
  }

  // No job ID selected
  if (!jobDescriptionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Job Description</h2>
            <p className="text-gray-600 mb-4">Please select a job description to analyze your resume against.</p>
            {jobDescriptions && jobDescriptions.length > 0 ? (
              <div className="space-y-2">
                {jobDescriptions.map((job) => (
                  <a
                    key={job._id}
                    href={`/resume?jobId=${job._id}`}
                    className="block p-4 border rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No job descriptions found. Create one first!</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Resume Analysis"
          subtitle="Get personalized feedback for"
          highlight={jobDescriptions?.find(j => j._id === jobDescriptionId)?.title || 'Loading...'}
        />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {progress && <StatusAlert type="loading" message={progress} />}
          {error && <StatusAlert type="error" message={error} />}
          
          <FileDropzone
            file={file}
            onFileSelect={handleFileSelect}
            disabled={loading}
            formatFileSize={formatFileSize}
          />
          
          {file && !progress && (
            <ActionButtons
              onSubmit={uploadAndAnalyze}
              onCancel={reset}
              loading={loading}
              loadingText={loading ? 'Processing...' : 'Upload & Analyze'}
            />
          )}
        </div>

        <ResumeList resumes={resumes || []} formatFileSize={formatFileSize} />
      </div>
    </div>
  );
}