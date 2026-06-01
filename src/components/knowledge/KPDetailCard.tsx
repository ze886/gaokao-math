import { useMemo } from 'react';
import type { DifficultyLevel } from '../../types';
import { DIFFICULTY_HEX, TREND_COLORS } from '../../constants';
import type { KPStats } from '../../hooks/useKnowledgePointStats';
import { TrendSparkline } from '../prediction/TrendSparkline';

interface Props {
  stats: KPStats;
}

export function KPDetailCard({ stats }: Props) {
  const { knowledgePoint: kp } = stats;
  const diffOrder: DifficultyLevel[] = ['基础', '中等', '较难', '压轴'];

  const maxDiff = useMemo(
    () => Math.max(...diffOrder.map((d) => stats.difficultyDistribution[d]), 1),
    [stats.difficultyDistribution]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{kp.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{kp.description}</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
          {kp.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.totalAppearances}</p>
          <p className="text-xs text-gray-500">总出现次数</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{kp.syllabusWeight}/10</p>
          <p className="text-xs text-gray-500">考纲权重</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className={`text-2xl font-bold ${TREND_COLORS[stats.trend.direction as keyof typeof TREND_COLORS]}`}>
            {stats.trend.direction === 'rising' ? '↑' : stats.trend.direction === 'declining' ? '↓' : '→'}
          </p>
          <p className="text-xs text-gray-500">五年趋势</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.relatedQuestions.length}</p>
          <p className="text-xs text-gray-500">关联题目</p>
        </div>
      </div>

      {/* Yearly frequency */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">逐年出现频率</h4>
        <div className="flex items-center gap-4">
          <TrendSparkline data={stats.yearlyFrequency} width={160} height={40} />
          <div className="flex gap-3">
            {stats.yearlyFrequency.map((d) => (
              <div key={d.year} className="text-center">
                <p className="text-xs text-gray-500">{d.year}</p>
                <p className="text-sm font-semibold text-gray-900">{d.count}次</p>
                <p className="text-xs text-gray-400">{(d.proportion * 100).toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty distribution */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">难度分布</h4>
        <div className="space-y-2">
          {diffOrder.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <span className="w-8 text-xs text-gray-500">{d}</span>
              <div className="h-3 flex-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(stats.difficultyDistribution[d] / maxDiff) * 100}%`,
                    backgroundColor: DIFFICULTY_HEX[d],
                  }}
                />
              </div>
              <span className="w-6 text-xs font-medium text-gray-700 text-right">
                {stats.difficultyDistribution[d]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
