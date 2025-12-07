interface KeywordBadgesProps {
  keywords: string[];
  title?: string;
}

export function KeywordBadges({ keywords, title = 'Keywords Found' }: KeywordBadgesProps) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">📝 {title}</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}