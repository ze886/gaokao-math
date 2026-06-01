import { CONFIDENCE_COLORS } from '../../constants';

interface Props {
  confidence: number;
  label: '高' | '中' | '低';
}

export function ConfidenceBadge({ confidence, label }: Props) {
  const colorClass = CONFIDENCE_COLORS[label];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${label === '高' ? 'bg-green-500' : label === '中' ? 'bg-amber-500' : 'bg-gray-400'}`} />
      {label} ({Math.round(confidence * 100)}%)
    </span>
  );
}
