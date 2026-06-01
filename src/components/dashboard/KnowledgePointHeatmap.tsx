import type { Question, KnowledgeCategory } from '../../types';
import { CATEGORY_ORDER, CATEGORY_HEX } from '../../constants';
import { getKnowledgePoints } from '../../utils/data-loader';

interface Props {
  questions: Question[];
}

export function KnowledgePointHeatmap({ questions }: Props) {
  const allKPs = getKnowledgePoints();
  const years = [2022, 2023, 2024, 2025, 2026];

  // Group KPs by category
  const kpsByCategory = new Map<KnowledgeCategory, typeof allKPs>();
  for (const kp of allKPs) {
    const list = kpsByCategory.get(kp.category) || [];
    list.push(kp);
    kpsByCategory.set(kp.category, list);
  }

  // Compute max frequency for color scaling
  let maxFreq = 0;
  const freqMap = new Map<string, number>();
  for (const kp of allKPs) {
    for (const year of years) {
      const yearQs = questions.filter((q) => q.year === year);
      const count = yearQs.filter((q) => q.knowledgePointIds.includes(kp.id)).length;
      const freq = yearQs.length > 0 ? count / yearQs.length : 0;
      const key = `${kp.id}-${year}`;
      freqMap.set(key, freq);
      if (freq > maxFreq) maxFreq = freq;
    }
  }

  const getColor = (freq: number) => {
    if (freq === 0) return 'bg-gray-50';
    const intensity = freq / Math.max(maxFreq, 1);
    if (intensity > 0.6) return 'bg-indigo-500';
    if (intensity > 0.3) return 'bg-indigo-300';
    return 'bg-indigo-100';
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">知识点×年份 热度图</h3>
      <div className="inline-block min-w-full">
        {/* Header row: years */}
        <div className="flex mb-1">
          <div className="w-28 shrink-0" />
          {years.map((y) => (
            <div key={y} className="w-12 text-center text-xs font-medium text-gray-500">{y}</div>
          ))}
        </div>
        {CATEGORY_ORDER.map((cat) => {
          const kps = kpsByCategory.get(cat) || [];
          return (
            <div key={cat}>
              <div
                className="text-xs font-medium py-1 px-2 rounded mb-0.5"
                style={{ color: CATEGORY_HEX[cat] }}
              >
                {cat}
              </div>
              {kps.map((kp) => (
                <div key={kp.id} className="flex items-center mb-0.5">
                  <div className="w-28 shrink-0 text-xs text-gray-500 truncate pr-1" title={kp.name}>{kp.name}</div>
                  {years.map((year) => {
                    const freq = freqMap.get(`${kp.id}-${year}`) || 0;
                    return (
                      <div
                        key={year}
                        className={`w-12 h-6 flex items-center justify-center text-xs font-mono ${getColor(freq)} ${freq > 0 ? 'text-white' : 'text-gray-300'}`}
                        title={`${kp.name} ${year}年: ${(freq * 100).toFixed(0)}%`}
                      >
                        {freq > 0 ? (freq * 100).toFixed(0) : '·'}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
