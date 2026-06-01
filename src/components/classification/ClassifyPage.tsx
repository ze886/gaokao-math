import { useState, useMemo } from 'react';
import { FilterBar } from './FilterBar';
import { QuestionTable } from './QuestionTable';
import { QuestionDetail } from './QuestionDetail';
import { useFilters } from '../../hooks/useFiltersState';
import { useFilteredQuestions } from '../../hooks/useFilteredQuestions';
import { getKnowledgePointMap } from '../../utils/data-loader';
import { sortQuestions } from '../../utils/classification';
import type { Question } from '../../types';

export function ClassifyPage() {
  const {
    filters, setYear, setPaperType, setKnowledgePoint, setDifficulty, setQuestionType, setSearch, reset,
  } = useFilters();

  const filteredQuestions = useFilteredQuestions(filters);
  const kpMap = useMemo(() => getKnowledgePointMap(), []);
  const sortedQuestions = useMemo(() => sortQuestions(filteredQuestions, 'year'), [filteredQuestions]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        setYear={setYear}
        setPaperType={setPaperType}
        setKnowledgePoint={setKnowledgePoint}
        setDifficulty={setDifficulty}
        setQuestionType={setQuestionType}
        setSearch={setSearch}
        reset={reset}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          共找到 <span className="font-semibold text-gray-900">{sortedQuestions.length}</span> 道题目
        </p>
      </div>
      <QuestionTable
        questions={sortedQuestions}
        kpMap={kpMap}
        onSelect={setSelectedQuestion}
      />
      <QuestionDetail
        question={selectedQuestion}
        kpMap={kpMap}
        onClose={() => setSelectedQuestion(null)}
      />
    </div>
  );
}
