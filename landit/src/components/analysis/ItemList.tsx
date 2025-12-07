type ListType = 'issues' | 'recommendations' | 'strengths' | 'gaps' | 'suggestions';

interface ItemListProps {
  type: ListType;
  title: string;
  items: string[];
}

const listConfig = {
  issues: { icon: '✗', color: 'text-red-500', titleColor: 'text-red-700' },
  recommendations: { icon: '→', color: 'text-blue-500', titleColor: 'text-blue-700' },
  strengths: { icon: '✓', color: 'text-green-500', titleColor: 'text-green-700' },
  gaps: { icon: '⚠', color: 'text-yellow-500', titleColor: 'text-yellow-700' },
  suggestions: { icon: '💡', color: 'text-purple-500', titleColor: 'text-purple-700' },
};

export function ItemList({ type, title, items }: ItemListProps) {
  if (!items || items.length === 0) return null;

  const config = listConfig[type];

  return (
    <div className="mb-4 last:mb-0">
      <h4 className={`font-semibold ${config.titleColor} mb-2`}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2 text-sm text-gray-700">
            <span className={config.color}>{config.icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
