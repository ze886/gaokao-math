import { useMemo } from 'react';
import { useAllQuestions } from '../../hooks/useAllQuestions';
import { getKnowledgePoints } from '../../utils/data-loader';
import { computeDifficultyDistribution } from '../../utils/statistics';
import { StatCard } from './StatCard';
import { YearOverviewChart } from './YearOverviewChart';
import { DifficultyDonut } from './DifficultyDonut';
import { KnowledgePointHeatmap } from './KnowledgePointHeatmap';

export function DashboardPage() {
  const questions = useAllQuestions();
  const kps = useMemo(() => getKnowledgePoints(), []);

  const stats = useMemo(() => {
    const diffDist = computeDifficultyDistribution(questions);
    const paperTypes = new Set(questions.map((q) => q.paperType));
    const years = new Set(questions.map((q) => q.year));
    return {
      totalQuestions: questions.length,
      totalKPs: kps.length,
      totalPapers: paperTypes.size,
      yearSpan: `${Math.min(...years)}-${Math.max(...years)}`,
      diffDist,
    };
  }, [questions, kps]);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="收录题目总数"
          value={stats.totalQuestions}
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          color="bg-indigo-500"
        />
        <StatCard
          label="知识考点"
          value={stats.totalKPs}
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
          color="bg-violet-500"
        />
        <StatCard
          label="试卷类型"
          value={stats.totalPapers}
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          color="bg-amber-500"
        />
        <StatCard
          label="年份跨度"
          value={stats.yearSpan}
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          color="bg-teal-500"
        />
      </div>

      {/* Charts row */}
      <YearOverviewChart questions={questions} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DifficultyDonut distribution={stats.diffDist} total={stats.totalQuestions} />
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">试卷类型分布</h3>
          <div className="space-y-3">
            {['新高考I卷', '新高考II卷', '全国甲卷', '全国乙卷'].map((pt) => {
              const count = questions.filter((q) => q.paperType === pt).length;
              return (
                <div key={pt}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{pt}</span>
                    <span className="font-medium text-gray-900">{count} 题</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${(count / Math.max(questions.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <KnowledgePointHeatmap questions={questions} />
    </div>
  );
}
