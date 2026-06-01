import { useMemo } from 'react';
import { loadAllQuestions } from '../utils/data-loader';
import type { Question } from '../types';

export function useAllQuestions(): Question[] {
  return useMemo(() => loadAllQuestions(), []);
}
