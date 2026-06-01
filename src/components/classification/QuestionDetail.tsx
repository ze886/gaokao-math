import type { Question, KnowledgePoint } from '../../types';
import { Modal } from '../shared/Modal';
import { Badge } from '../shared/Badge';
import { Chip } from '../shared/Chip';

interface QuestionDetailProps {
  question: Question | null;
  kpMap: Map<string, KnowledgePoint>;
  onClose: () => void;
}

export function QuestionDetail({ question, kpMap, onClose }: QuestionDetailProps) {
  if (!question) return null;

  return (
    <Modal open={!!question} onClose={onClose} title={`第${question.questionNumber}题 · ${question.title}`}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
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

        <div className="flex flex-wrap gap-1">
          {question.knowledgePointIds.map((kpId) => {
            const kp = kpMap.get(kpId);
            return kp ? (
              <Chip key={kpId} label={kp.name} category={kp.category} size="md" />
            ) : null;
          })}
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">题目内容</h4>
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{question.content}</p>
        </div>

        <div className="rounded-lg bg-indigo-50 p-4">
          <h4 className="text-sm font-medium text-indigo-700 mb-2">解题提示</h4>
          <p className="text-sm text-indigo-800 leading-relaxed">{question.solutionHint}</p>
        </div>
      </div>
    </Modal>
  );
}
