interface AnalysisScoreProps {
  score: number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  purple: 'bg-purple-50 text-purple-700',
  red: 'bg-red-50 text-red-700',
  yellow: 'bg-yellow-50 text-yellow-700',
};

export function AnalysisScore({ score, label, color = 'blue' }: AnalysisScoreProps) {
  return (
    <div className={`${colorStyles[color]} rounded-lg p-3 text-center`}>
      <div className="text-2xl font-bold">{score}%</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}
