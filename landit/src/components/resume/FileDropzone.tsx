import { Upload, FileText } from 'lucide-react';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  formatFileSize: (bytes: number) => string;
}

export function FileDropzone({ file, onFileSelect, disabled, formatFileSize }: FileDropzoneProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && !disabled) onFileSelect(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onFileSelect(selectedFile);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        file ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleChange}
        disabled={disabled}
      />
      <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
        {file ? (
          <>
            <FileText className="w-16 h-16 text-purple-600 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-1">{file.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your resume here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, Word (.docx) and text files (max 10MB)
            </p>
          </>
        )}
      </label>
    </div>
  );
}