interface PageHeaderProps {
  title: string;
  subtitle: string;
  highlight?: string;
}

export function PageHeader({ title, subtitle, highlight }: PageHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">
        {subtitle}{' '}
        {highlight && (
          <span className="font-semibold text-purple-600">{highlight}</span>
        )}
      </p>
    </div>
  );
}