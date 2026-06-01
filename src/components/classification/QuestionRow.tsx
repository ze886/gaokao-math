import type { Question, KnowledgePoint } from '../../types';
import { Badge } from '../shared/Badge';
import { Chip } from '../shared/Chip';

interface QuestionRowProps {
  question: Question;
  kpMap: Map<string, KnowledgePoint>;
  onSelect: (q: Question) => void;
}

export function QuestionRow({ question, kpMap, onSelect }: QuestionRowProps) {
  return (
    <tr
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onSelect(question)}
    >
      <td className="px-4 py-3 text-sm text-gray-500 w-12">{question.questionNumber}</td>
      <td className="px-4 py-3">
        <Badge difficulty={question.difficulty} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{question.questionType}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {question.knowledgePointIds.map((kpId) => {
            const kp = kpMap.get(kpId);
            return kp ? (
              <Chip key={kpId} label={kp.name} category={kp.category} />
            ) : null;
          })}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-xs truncate">
        {question.title}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 w-12">{question.score}分</td>
      <td className="px-4 py-3">
        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          详情
        </button>
      </td>
    </tr>
  );
}
