import { useMemo } from 'react';
import type { KnowledgePointPrediction } from '../../types';
import { computeKPYearlyFrequency } from '../../utils/statistics';
import { loadAllQuestions } from '../../utils/data-loader';
import { PredictionRow } from './PredictionRow';

interface Props {
  predictions: KnowledgePointPrediction[];
  getConfidenceLabel: (c: number) => '高' | '中' | '低';
}

export function PredictionTable({ predictions, getConfidenceLabel }: Props) {
  const allQuestions = useMemo(() => loadAllQuestions(), []);

  if (predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm">暂无法生成预测数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3">排名</th>
            <th className="px-4 py-3">类别</th>
            <th className="px-4 py-3">考点名称</th>
            <th className="px-4 py-3">出题概率</th>
            <th className="px-4 py-3">趋势</th>
            <th className="px-4 py-3">置信度</th>
            <th className="px-4 py-3">预测题型</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p, i) => {
            const freq = computeKPYearlyFrequency(p.knowledgePointId, allQuestions);
            return (
              <PredictionRow
                key={p.knowledgePointId}
                prediction={p}
                rank={i + 1}
                yearlyData={freq.yearlyCounts}
                getConfidenceLabel={getConfidenceLabel}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
