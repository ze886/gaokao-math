import { useMemo } from 'react';
import { loadAllQuestions } from '../utils/data-loader';
import { filterQuestions } from '../utils/classification';
import type { Question, FilterState } from '../types';

export function useFilteredQuestions(filters: FilterState): Question[] {
  const allQuestions = useMemo(() => loadAllQuestions(), []);
  return useMemo(() => filterQuestions(allQuestions, filters), [allQuestions, filters]);
}
