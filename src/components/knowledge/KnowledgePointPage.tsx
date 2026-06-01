import { useState, useMemo } from 'react';
import { useKnowledgePointStats } from '../../hooks/useKnowledgePointStats';
import { getKnowledgePoints, getKnowledgePointMap } from '../../utils/data-loader';
import { KPDetailCard } from './KPDetailCard';
import { ExampleQuestionList } from './ExampleQuestionList';
import { QuestionDetail } from '../classification/QuestionDetail';
import type { Question } from '../../types';

export function KnowledgePointPage() {
  const allKPs = useMemo(() => getKnowledgePoints(), []);
  const kpMap = useMemo(() => getKnowledgePointMap(), []);
  const [selectedKpId, setSelectedKpId] = useState<string>(allKPs[0]?.id ?? '');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const stats = useKnowledgePointStats(selectedKpId);

  // Group KPs by category for the selector
  const groupedKPs = useMemo(() => {
    const map = new Map<string, typeof allKPs>();
    for (const kp of allKPs) {
      const list = map.get(kp.category) || [];
      list.push(kp);
      map.set(kp.category, list);
    }
    return map;
  }, [allKPs]);

  return (
    <div className="space-y-6">
      {/* KP Selector */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 block mb-3">选择知识点查看详情</label>
        <div className="flex flex-wrap gap-2">
          {Array.from(groupedKPs.entries()).map(([cat, kps]) => (
            <div key={cat} className="flex flex-wrap gap-1 items-center">
              <span className="text-xs font-medium text-gray-400 mr-1">{cat}:</span>
              {kps.map((kp) => (
                <button
                  key={kp.id}
                  onClick={() => setSelectedKpId(kp.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedKpId === kp.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {kp.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Detail card */}
      {stats && <KPDetailCard stats={stats} />}

      {/* Example questions */}
      {stats && (
        <ExampleQuestionList
          questions={stats.exampleQuestions.length > 0 ? stats.exampleQuestions : stats.relatedQuestions.slice(0, 5)}
          kpMap={kpMap}
          onSelect={setSelectedQuestion}
        />
      )}

      {/* Question detail modal */}
      <QuestionDetail
        question={selectedQuestion}
        kpMap={kpMap}
        onClose={() => setSelectedQuestion(null)}
      />
    </div>
  );
}
