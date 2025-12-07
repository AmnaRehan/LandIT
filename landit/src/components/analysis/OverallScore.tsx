interface OverallScoreProps {
  score: number;
}

export function OverallScore({ score }: OverallScoreProps) {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-gray-700">Overall Score</span>
        <span className="text-5xl font-bold text-purple-600">{score}/10</span>
      </div>
    </div>
  );
}