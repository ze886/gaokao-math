import type { Question, KnowledgePoint } from '../../types';
import { Badge } from '../shared/Badge';
import { Chip } from '../shared/Chip';

interface Props {
  questions: Question[];
  kpMap: Map<string, KnowledgePoint>;
  onSelect: (q: Question) => void;
}

export function ExampleQuestionList({ questions, kpMap, onSelect }: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
        <p className="text-sm">暂无标注的例题</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b px-5 py-3">
        <h3 className="text-sm font-semibold text-gray-700">
          例题 ({questions.length})
        </h3>
      </div>
      <div className="divide-y">
        {questions.map((q) => (
          <div
            key={q.id}
            className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelect(q)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{q.year}年 · {q.paperType} · 第{q.questionNumber}题</span>
                <Badge difficulty={q.difficulty} />
                <span className="text-xs text-gray-500">{q.questionType} · {q.score}分</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">{q.title}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{q.content}</p>
            <div className="flex flex-wrap gap-1">
              {q.knowledgePointIds.map((kpId) => {
                const kp = kpMap.get(kpId);
                return kp ? <Chip key={kpId} label={kp.name} category={kp.category} /> : null;
              })}
            </div>
            {q.solutionHint && (
              <p className="mt-2 text-xs text-indigo-600 bg-indigo-50 rounded p-2">
                <span className="font-medium">提示：</span>{q.solutionHint}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
