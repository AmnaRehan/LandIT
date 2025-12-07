import { Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  loadingText?: string;
  submitText?: string;
}

export function ActionButtons({
  onSubmit,
  onCancel,
  loading,
  loadingText = 'Processing...',
  submitText = 'Upload & Analyze',
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {loadingText}
          </>
        ) : (
          submitText
        )}
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}