import type { KnowledgeCategory } from '../../types';
import { CATEGORY_COLORS } from '../../constants';

interface ChipProps {
  label: string;
  category?: KnowledgeCategory;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function Chip({ label, category, size = 'sm', onClick }: ChipProps) {
  const colorClass = category ? CATEGORY_COLORS[category] : 'bg-gray-100 text-gray-600 border-gray-200';
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';
  const clickClass = onClick ? 'cursor-pointer hover:opacity-80' : '';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass} ${clickClass}`}
      onClick={onClick}
    >
      {label}
    </span>
  );
}
