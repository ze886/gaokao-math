import type { KnowledgePointPrediction } from '../../types';
import { TrendSparkline } from './TrendSparkline';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Chip } from '../shared/Chip';
import { TREND_COLORS } from '../../constants';

interface Props {
  prediction: KnowledgePointPrediction;
  rank: number;
  yearlyData: { year: number; proportion: number }[];
  getConfidenceLabel: (c: number) => '高' | '中' | '低';
}

export function PredictionRow({ prediction, rank, yearlyData, getConfidenceLabel }: Props) {
  const confLabel = getConfidenceLabel(prediction.confidence);
  const probPercent = Math.round(prediction.probability * 100);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-bold text-gray-400 w-10">#{rank}</td>
      <td className="px-4 py-3">
        <Chip label={prediction.category} category={prediction.category} size="md" />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{prediction.knowledgePointName}</div>
      </td>
      <td className="px-4 py-3 w-48">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-700"
              style={{ width: `${probPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900 w-10 text-right">{probPercent}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <TrendSparkline data={yearlyData} />
          <span className={`text-xs font-medium ${TREND_COLORS[prediction.trend]}`}>
            {prediction.trend === 'rising' ? '↑上升' : prediction.trend === 'declining' ? '↓下降' : '→稳定'}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <ConfidenceBadge confidence={prediction.confidence} label={confLabel} />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {prediction.predictedQuestionTypes.map((pt) => (
            <span key={pt.type} className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
              {pt.type}({pt.predictedCount}题)
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}
