import type { DifficultyLevel } from '../../types';
import { DIFFICULTY_COLORS } from '../../constants';

interface BadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md';
}

export function Badge({ difficulty, size = 'sm' }: BadgeProps) {
  const colorClass = DIFFICULTY_COLORS[difficulty];
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}>
      {difficulty}
    </span>
  );
}
