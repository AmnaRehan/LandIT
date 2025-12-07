import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading analysis...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}