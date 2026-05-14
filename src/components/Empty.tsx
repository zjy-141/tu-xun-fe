interface EmptyProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Empty({
  icon = '📭',
  title = '暂无内容',
  description = '',
  action,
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-medium text-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-light max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
