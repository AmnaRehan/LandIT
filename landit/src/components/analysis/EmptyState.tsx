import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No analysis available' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <AlertCircle className="w-12 h-12 mb-4" />
      <p className="text-center">{message}</p>
    </div>
  );
}