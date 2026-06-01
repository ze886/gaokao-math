import { useState } from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionTable } from './PredictionTable';
import { PAPER_TYPES } from '../../constants';
import type { PaperType } from '../../types';

export function PredictPage() {
  const [paperType, setPaperType] = useState<PaperType>('新高考I卷');
  const { predictions, getConfidenceLabel } = usePredictions(paperType);

  const highProb = predictions.filter((p) => p.probability >= 0.7).length;
  const rising = predictions.filter((p) => p.trend === 'rising').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">考点预测分析</h2>
          <p className="text-sm text-gray-500">
            基于频率分析 · 趋势回归 · 考纲权重 三维度综合预测
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">目标试卷：</span>
          <select
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            value={paperType}
            onChange={(e) => setPaperType(e.target.value as PaperType)}
          >
            {PAPER_TYPES.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-xs text-green-600 font-medium">高概率考点(≥70%)</p>
          <p className="text-2xl font-bold text-green-700">{highProb}</p>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-xs text-indigo-600 font-medium">呈上升趋势</p>
          <p className="text-2xl font-bold text-indigo-700">{rising}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs text-gray-600 font-medium">考纲高权重</p>
          <p className="text-2xl font-bold text-gray-700">函数/解析/立体</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-600 font-medium">预测模型</p>
          <p className="text-sm font-bold text-amber-700">40%频率+35%趋势+25%考纲</p>
        </div>
      </div>

      {/* Methodology note */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 text-sm text-indigo-700">
        <strong>预测方法说明：</strong>
        综合概率 = 0.40 × 历史出现频率 + 0.35 × 五年趋势回归 + 0.25 × 教育部考纲权重。
        置信度反映数据充足程度——数据点越多、年份跨度越大，置信度越高。趋势通过线性回归斜率计算，经Sigmoid函数归一化。
      </div>

      {/* Table */}
      <PredictionTable predictions={predictions} getConfidenceLabel={getConfidenceLabel} />
    </div>
  );
}
