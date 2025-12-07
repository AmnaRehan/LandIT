interface SuggestionCardProps {
  suggestions: string[];
  title?: string;
}

export function SuggestionCard({ suggestions, title = 'Top Suggestions' }: SuggestionCardProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-purple-50 rounded-lg p-5">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>💡</span>
        {title}
      </h3>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex gap-3 text-gray-700">
            <span className="text-purple-600 font-bold flex-shrink-0">{index + 1}.</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}