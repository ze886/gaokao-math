import type { Question, KnowledgePoint } from '../../types';
import { Modal } from '../shared/Modal';
import { Badge } from '../shared/Badge';
import { Chip } from '../shared/Chip';
import { MathText } from '../shared/MathText';

interface QuestionDetailProps {
  question: Question | null;
  kpMap: Map<string, KnowledgePoint>;
  onClose: () => void;
}

export function QuestionDetail({ question, kpMap, onClose }: QuestionDetailProps) {
  if (!question) return null;

  const steps = question.solutionSteps || [];

  return (
    <Modal open={!!question} onClose={onClose} title={`第${question.questionNumber}题 · ${question.title}`}>
      <div className="space-y-5">
        {/* Meta info */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="font-medium">{question.year}年</span>
            <span>·</span>
            <span>{question.paperType}</span>
          </div>
          <Badge difficulty={question.difficulty} size="md" />
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
            {question.questionType} · {question.score}分
          </span>
        </div>

        {/* Knowledge point tags */}
        <div className="flex flex-wrap gap-1.5">
          {question.knowledgePointIds.map((kpId) => {
            const kp = kpMap.get(kpId);
            return kp ? (
              <Chip key={kpId} label={kp.name} category={kp.category} size="md" />
            ) : null;
          })}
        </div>

        {/* Forecast note */}
        {question.forecastNote && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <span className="text-xs font-medium text-amber-600">预测依据：</span>
            <span className="text-sm text-amber-700 ml-1">{question.forecastNote}</span>
          </div>
        )}

        {/* Problem content */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">题</span>
            题目内容
          </h4>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              <MathText text={question.content} />
            </div>
          </div>
        </div>

        {/* Solution hint (summary) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">析</span>
            解题思路
          </h4>
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-blue-800 leading-relaxed">
              <MathText text={question.solutionHint} />
            </div>
          </div>
        </div>

        {/* Step-by-step solution */}
        {steps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">解</span>
              详细解析
            </h4>
            <div className="rounded-lg bg-green-50/50 border border-green-100 p-4">
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-700 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="text-sm text-gray-800 leading-relaxed">
                      <MathText text={step} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
