import { useMemo } from 'react';
import { loadAllQuestions, getKnowledgePoints } from '../utils/data-loader';
import { computeKPYearlyFrequency, computeDifficultyDistribution } from '../utils/statistics';
import { computeTrendScore } from '../utils/trend';
import type { Question, KnowledgePoint, DifficultyLevel } from '../types';

export interface KPStats {
  knowledgePoint: KnowledgePoint;
  totalAppearances: number;
  yearlyFrequency: { year: number; count: number; proportion: number }[];
  difficultyDistribution: Record<DifficultyLevel, number>;
  trend: { direction: string; slope: number };
  exampleQuestions: Question[];
  relatedQuestions: Question[];
}

export function useKnowledgePointStats(kpId: string | null): KPStats | null {
  const allQuestions = useMemo(() => loadAllQuestions(), []);
  const allKPs = useMemo(() => getKnowledgePoints(), []);

  return useMemo(() => {
    if (!kpId) return null;

    const kp = allKPs.find((k) => k.id === kpId);
    if (!kp) return null;

    const freq = computeKPYearlyFrequency(kpId, allQuestions);
    const totalAppearances = freq.yearlyCounts.reduce((s, d) => s + d.count, 0);
    const relatedQuestions = allQuestions.filter((q) => q.knowledgePointIds.includes(kpId));
    const difficultyDistribution = computeDifficultyDistribution(relatedQuestions);
    const trend = computeTrendScore(freq.yearlyCounts);
    const exampleQuestions = relatedQuestions
      .filter((q) => q.isExample)
      .slice(0, 5);

    return {
      knowledgePoint: kp,
      totalAppearances,
      yearlyFrequency: freq.yearlyCounts,
      difficultyDistribution,
      trend: { direction: trend.direction, slope: trend.slope },
      exampleQuestions,
      relatedQuestions,
    };
  }, [kpId, allQuestions, allKPs]);
}
