import { useState, useMemo } from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { useAllQuestions } from '../../hooks/useAllQuestions';
import { getKnowledgePointMap } from '../../utils/data-loader';
import { PredictionTable } from './PredictionTable';
import { QuestionDetail } from '../classification/QuestionDetail';
import { MathText } from '../shared/MathText';
import { Badge } from '../shared/Badge';
import { Chip } from '../shared/Chip';
import { PAPER_TYPES } from '../../constants';
import type { PaperType, Question } from '../../types';

export function PredictPage() {
  const [paperType, setPaperType] = useState<PaperType>('新高考I卷');
  const { predictions, getConfidenceLabel } = usePredictions(paperType);
  const allQuestions = useAllQuestions();
  const kpMap = useMemo(() => getKnowledgePointMap(), []);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const highProb = predictions.filter((p) => p.probability >= 0.7).length;
  const rising = predictions.filter((p) => p.trend === 'rising').length;

  // Get example questions for top-5 highest probability predictions
  const topPredictions = useMemo(
    () => predictions.slice(0, 5),
    [predictions]
  );

  const topExamples = useMemo(() => {
    return topPredictions.map((pred) => {
      const examples = allQuestions
        .filter((q) => q.knowledgePointIds.includes(pred.knowledgePointId) && q.isExample)
        .slice(0, 3);
      return { prediction: pred, examples };
    });
  }, [topPredictions, allQuestions]);

  return (
    <div className="space-y-5">
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
          <p className="text-xs text-green-600 font-medium">高概率考点 (≥70%)</p>
          <p className="text-2xl font-bold text-green-700">{highProb}</p>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-xs text-indigo-600 font-medium">呈上升趋势</p>
          <p className="text-2xl font-bold text-indigo-700">{rising}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs text-gray-600 font-medium">考纲核心</p>
          <p className="text-sm font-bold text-gray-700">函数·解析·立体</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-600 font-medium">预测模型</p>
          <p className="text-xs font-bold text-amber-700">40%频率+35%趋势+25%考纲</p>
        </div>
      </div>

      {/* Methodology */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 text-sm text-indigo-700 leading-relaxed">
        <strong>预测方法说明：</strong>
        综合概率 = {'$0.40 \\times$'} 历史出现频率 + {'$0.35 \\times$'} 五年趋势回归 + {'$0.25 \\times$'} 教育部考纲权重。
        趋势通过线性回归斜率经 Sigmoid 函数 {'$\\frac{1}{1+e^{-50k}}$'} 归一化。
        置信度反映样本充足程度——数据点越多、年份跨度越大，置信度越高。
      </div>

      {/* Prediction Table */}
      <PredictionTable predictions={predictions} getConfidenceLabel={getConfidenceLabel} />

      {/* Top-5 High Probability Examples */}
      <div className="rounded-xl border border-amber-200 bg-white overflow-hidden">
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-amber-800">
            🔥 高频考点真题例题 （预测概率 Top 5）
          </h3>
          <p className="text-xs text-amber-600 mt-0.5">
            以下为预测概率最高的5个知识点的历年真题例题，建议重点复习
          </p>
        </div>
        <div className="divide-y divide-amber-100">
          {topExamples.map(({ prediction, examples }) => (
            <div key={prediction.knowledgePointId} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Chip label={prediction.category} category={prediction.category} size="md" />
                <span className="text-sm font-semibold text-gray-900">{prediction.knowledgePointName}</span>
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  预测概率 {(prediction.probability * 100).toFixed(0)}%
                </span>
                <span className={`text-xs font-medium ${
                  prediction.trend === 'rising' ? 'text-green-600' :
                  prediction.trend === 'declining' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {prediction.trend === 'rising' ? '↑上升趋势' :
                   prediction.trend === 'declining' ? '↓下降趋势' : '→保持稳定'}
                </span>
              </div>
              {examples.length > 0 ? (
                <div className="space-y-2">
                  {examples.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-lg border border-gray-100 p-3 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">{q.year}年 · {q.paperType} · 第{q.questionNumber}题</span>
                        <Badge difficulty={q.difficulty} />
                        <span className="text-xs text-gray-500">{q.score}分</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        <MathText text={q.title} />
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        <MathText text={q.content} />
                      </p>
                      {q.solutionHint && (
                        <p className="mt-1.5 text-xs text-indigo-600 leading-relaxed">
                          💡 <MathText text={q.solutionHint} />
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">暂无相关例题，将在后续版本补充</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question detail modal */}
      <QuestionDetail
        question={selectedQuestion}
        kpMap={kpMap}
        onClose={() => setSelectedQuestion(null)}
      />
    </div>
  );
}
