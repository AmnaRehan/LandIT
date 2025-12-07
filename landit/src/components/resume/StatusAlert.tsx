import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

type AlertType = 'success' | 'error' | 'loading' | 'info';

interface StatusAlertProps {
  type: AlertType;
  message: string;
}

const alertStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  loading: 'bg-blue-50 border-blue-200 text-blue-800',
  info: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  loading: Loader2,
  info: AlertCircle,
};

export function StatusAlert({ type, message }: StatusAlertProps) {
  const Icon = icons[type];
  const iconClass = type === 'loading' ? 'animate-spin' : '';

  return (
    <div className={`p-3 border rounded-lg flex items-center gap-2 ${alertStyles[type]}`}>
      <Icon className={`w-5 h-5 ${iconClass}`} />
      <span>{message}</span>
    </div>
  );
}