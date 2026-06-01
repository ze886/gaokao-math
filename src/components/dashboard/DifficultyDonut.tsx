import type { DifficultyLevel } from '../../types';
import { DIFFICULTY_HEX } from '../../constants';

interface Props {
  distribution: Record<DifficultyLevel, number>;
  total: number;
}

export function DifficultyDonut({ distribution, total }: Props) {
  const r = 80;
  const cx = 110;
  const cy = 110;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * r;
  const order: DifficultyLevel[] = ['基础', '中等', '较难', '压轴'];

  let offset = 0;
  const segments = order.map((level) => {
    const count = distribution[level];
    const proportion = total > 0 ? count / total : 0;
    const length = proportion * circumference;
    const seg = { level, count, proportion, offset, length };
    offset += length;
    return seg;
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">难度分布</h3>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 220 220" width={220} height={220}>
          {segments.map((seg) => (
            <circle
              key={seg.level}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={DIFFICULTY_HEX[seg.level]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.length} ${circumference - seg.length}`}
              strokeDashoffset={-seg.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-500"
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" className="text-2xl font-bold fill-gray-900">{total}</text>
          <text x={cx} y={cy + 16} textAnchor="middle" className="text-xs fill-gray-500">总题数</text>
        </svg>
        <div className="flex flex-col gap-2">
          {segments.map((seg) => (
            <div key={seg.level} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: DIFFICULTY_HEX[seg.level] }} />
              <span className="text-sm text-gray-600">{seg.level}</span>
              <span className="text-sm font-semibold text-gray-900">{seg.count}</span>
              <span className="text-xs text-gray-400">({Math.round(seg.proportion * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
