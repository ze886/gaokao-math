import { useMemo } from 'react';
import { loadAllQuestions } from '../utils/data-loader';
import { predictForPaperType, getConfidenceLabel } from '../utils/prediction';
import type { KnowledgePointPrediction, PaperType } from '../types';

export function usePredictions(paperType: PaperType): {
  predictions: KnowledgePointPrediction[];
  getConfidenceLabel: (c: number) => '高' | '中' | '低';
} {
  const allQuestions = useMemo(() => loadAllQuestions(), []);
  const predictions = useMemo(
    () => predictForPaperType(paperType, allQuestions),
    [paperType, allQuestions]
  );
  return { predictions, getConfidenceLabel };
}
