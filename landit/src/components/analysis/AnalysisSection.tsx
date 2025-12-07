interface AnalysisSectionProps {
  title: string;
  icon: string;
  score: number;
  children: React.ReactNode;
}

export function AnalysisSection({ title, icon, score, children }: AnalysisSectionProps) {
  const scoreColor = score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        <span className={`text-2xl font-bold ${scoreColor}`}>{score}%</span>
      </div>
      {children}
    </div>
  );
}