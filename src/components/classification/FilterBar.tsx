import { Select } from '../shared/Select';
import { SearchInput } from '../shared/SearchInput';
import { YEARS, PAPER_TYPES, DIFFICULTY_LEVELS, QUESTION_TYPES } from '../../constants';
import { getKnowledgePoints } from '../../utils/data-loader';
import type { FilterState, PaperType, DifficultyLevel, QuestionType } from '../../types';
import { useMemo } from 'react';

interface FilterBarProps {
  filters: FilterState;
  setYear: (y: number | null) => void;
  setPaperType: (pt: PaperType | null) => void;
  setKnowledgePoint: (kp: string | null) => void;
  setDifficulty: (d: DifficultyLevel | null) => void;
  setQuestionType: (qt: QuestionType | null) => void;
  setSearch: (q: string) => void;
  reset: () => void;
}

export function FilterBar({
  filters, setYear, setPaperType, setKnowledgePoint, setDifficulty, setQuestionType, setSearch, reset,
}: FilterBarProps) {
  const kps = useMemo(() => getKnowledgePoints(), []);

  const yearOptions = YEARS.map((y) => ({ value: String(y) as '', label: `${y}年` }));
  const ptOptions = PAPER_TYPES.map((pt) => ({ value: pt as '', label: pt }));
  const kpOptions = kps.map((kp) => ({ value: kp.id, label: kp.name }));
  const diffOptions = DIFFICULTY_LEVELS.map((d) => ({ value: d as '', label: d }));
  const qtOptions = QUESTION_TYPES.map((qt) => ({ value: qt as '', label: qt }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Select label="年份" value={filters.year ? String(filters.year) as '' : null} options={yearOptions} onChange={(v) => setYear(v ? Number(v) : null)} />
        <Select label="试卷类型" value={filters.paperType} options={ptOptions} onChange={setPaperType} />
        <Select label="知识点" value={filters.knowledgePointId} options={kpOptions} onChange={setKnowledgePoint} placeholder="全部知识点" />
        <Select label="难度" value={filters.difficulty} options={diffOptions} onChange={setDifficulty} />
        <Select label="题型" value={filters.questionType} options={qtOptions} onChange={setQuestionType} />
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-gray-500 block mb-1">搜索</label>
          <SearchInput value={filters.searchQuery} onChange={setSearch} placeholder="搜索题目内容..." />
        </div>
        <button
          onClick={reset}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
        >
          重置
        </button>
      </div>
    </div>
  );
}
