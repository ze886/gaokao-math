import type { Question, PaperType } from '../../types';
import { PAPER_TYPES } from '../../constants';
import { computeYearlyQuestionCountsByPaper } from '../../utils/statistics';

interface Props {
  questions: Question[];
}

const PAPER_COLORS: Record<string, string> = {
  '新高考I卷': '#6366f1',
  '新高考II卷': '#8b5cf6',
  '全国甲卷': '#f59e0b',
  '全国乙卷': '#14b8a6',
};

export function YearOverviewChart({ questions }: Props) {
  const data = computeYearlyQuestionCountsByPaper(questions, PAPER_TYPES as PaperType[]);
  const barWidth = 30;
  const gap = 12;
  const groupGap = 50;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = padding.left + data.length * (PAPER_TYPES.length * (barWidth + gap) + groupGap) + padding.right;
  const chartHeight = 280;
  const maxVal = 25;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">各年份试卷题目数量分布</h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width={chartWidth} height={chartHeight}>
          {/* Y axis */}
          {[0, 5, 10, 15, 20, 25].map((v) => {
            const y = chartHeight - padding.bottom - (v / maxVal) * (chartHeight - padding.top - padding.bottom);
            return (
              <g key={v}>
                <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#f3f4f6" />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-xs fill-gray-400">{v}</text>
              </g>
            );
          })}
          {/* Bars */}
          {data.map((d, gi) => {
            const groupX = padding.left + gi * (PAPER_TYPES.length * (barWidth + gap) + groupGap);
            return (
              <g key={d.year}>
                {PAPER_TYPES.map((pt, pi) => {
                  const count = d.papers[pt] || 0;
                  const barH = (count / maxVal) * (chartHeight - padding.top - padding.bottom);
                  const x = groupX + pi * (barWidth + gap);
                  const y = chartHeight - padding.bottom - barH;
                  return (
                    <g key={pt}>
                      <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill={PAPER_COLORS[pt]} opacity={0.85} />
                      <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="text-xs fill-gray-500">{count}</text>
                    </g>
                  );
                })}
                <text x={groupX + (PAPER_TYPES.length * (barWidth + gap) - gap) / 2} y={chartHeight - 8} textAnchor="middle" className="text-sm fill-gray-600">{d.year}</text>
              </g>
            );
          })}
          {/* Legend */}
          <g transform={`translate(${chartWidth - padding.right - 280}, ${padding.top})`}>
            {PAPER_TYPES.map((pt, i) => (
              <g key={pt} transform={`translate(${i * 72}, 0)`}>
                <rect width={12} height={12} rx={2} fill={PAPER_COLORS[pt]} />
                <text x={16} y={10} className="text-xs fill-gray-500">{pt}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
