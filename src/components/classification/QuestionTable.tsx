import type { Question, KnowledgePoint } from '../../types';
import { QuestionRow } from './QuestionRow';

interface QuestionTableProps {
  questions: Question[];
  kpMap: Map<string, KnowledgePoint>;
  onSelect: (q: Question) => void;
}

export function QuestionTable({ questions, kpMap, onSelect }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">没有找到符合条件的题目</p>
        <p className="text-xs mt-1">请调整筛选条件后重试</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3">题号</th>
            <th className="px-4 py-3">难度</th>
            <th className="px-4 py-3">题型</th>
            <th className="px-4 py-3">知识点</th>
            <th className="px-4 py-3">题目</th>
            <th className="px-4 py-3">分值</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <QuestionRow key={q.id} question={q} kpMap={kpMap} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
