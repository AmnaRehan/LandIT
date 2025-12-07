"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ResumeUploadSection({
  userId,
  jobDescriptionId,
  resumes,
}: {
  userId: string;
  jobDescriptionId: string;
  resumes: any[];
}) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.resume.generateUploadUrl);
  const createResume = useMutation(api.resume.createResume);
  const analyzeResume = useAction(api.resume.analyzeResumeWithAI);

  // -----------------------------
  // File Select Handler
  // -----------------------------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      return;
    }

    setFile(selected);
    setError("");
  };

  // -----------------------------
  // Upload & Analyze Handler
  // -----------------------------
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setStatus("Uploading...");

    try {
      // 1) Upload file to Convex storage
      const uploadUrl = await generateUploadUrl();
      const upload = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });

      const { storageId } = await upload.json();

      // 2) Create resume entry
      setStatus("Creating record...");
      const resumeId = await createResume({
        userId,
        jobDescriptionId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storageId,
      });

      // 3) Extract text locally
      setStatus("Extracting text...");
      const text = await file.text();

      // 4) AI analyze
      setStatus("Analyzing...");
      await analyzeResume({
        resumeId,
        resumeText: text,
        jobDescriptionId,
      });

      setStatus("Complete!");

      setTimeout(() => {
        router.push(`/analysis?resumeId=${resumeId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* STATUS */}
        {status && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-blue-800">{status}</span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* FILE DROPZONE */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            id="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            disabled={loading}
          />
          <label htmlFor="file" className="cursor-pointer">
            {file ? (
              <>
                <FileText className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, or TXT (max 10MB)</p>
              </>
            )}
          </label>
        </div>

        {/* ACTION BUTTONS */}
        {file && !status && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              Upload & Analyze
            </button>

            <button
              onClick={() => setFile(null)}
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* PREVIOUS UPLOADS */}
      {resumes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Previous Uploads</h3>

          <div className="space-y-2">
            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() =>
                  r.analyzed && router.push(`/analysis?resumeId=${r._id}`)
                }
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                  r.analyzed ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{r.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(r.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {r.analyzed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
