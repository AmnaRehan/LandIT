import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface Resume {
  _id: string;
  fileName: string;
  uploadedAt: number;
  fileSize: number;
  analyzed: boolean;
}

interface ResumeListProps {
  resumes: Resume[];
  formatFileSize: (bytes: number) => string;
  onResumeClick?: (resumeId: string) => void;
}

export function ResumeList({ resumes, formatFileSize, onResumeClick }: ResumeListProps) {
  if (!resumes || resumes.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Uploads</h3>
      <div className="space-y-3">
        {resumes.map((resume) => (
          <div
            key={resume._id}
            onClick={() => onResumeClick?.(resume._id)}
            className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
              onResumeClick ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{resume.fileName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(resume.uploadedAt).toLocaleDateString()} •{' '}
                  {formatFileSize(resume.fileSize)}
                </p>
              </div>
            </div>
            {resume.analyzed ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Analyzed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-yellow-600">
                <AlertCircle className="w-4 h-4" />
                Pending
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
