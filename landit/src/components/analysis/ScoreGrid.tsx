interface Score {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'purple';
}

interface ScoreGridProps {
  scores: Score[];
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  purple: 'bg-purple-50 text-purple-700',
};

export function ScoreGrid({ scores }: ScoreGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {scores.map((score, index) => (
        <div key={index} className={`${colorStyles[score.color]} rounded-lg p-4 text-center`}>
          <div className="text-3xl font-bold">{score.value}%</div>
          <div className="text-sm mt-1">{score.label}</div>
        </div>
      ))}
    </div>
  );
}