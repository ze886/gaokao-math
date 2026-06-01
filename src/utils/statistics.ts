import type { Question, DifficultyLevel, PaperType } from '../types';

export function computeFrequency(kpId: string, questions: Question[], paperType?: PaperType): number {
  const relevant = paperType
    ? questions.filter((q) => q.paperType === paperType)
    : questions;

  if (relevant.length === 0) return 0;

  const count = relevant.filter((q) => q.knowledgePointIds.includes(kpId)).length;
  return count / relevant.length;
}

export function computeDifficultyDistribution(questions: Question[]): Record<DifficultyLevel, number> {
  const dist: Record<DifficultyLevel, number> = { '基础': 0, '中等': 0, '较难': 0, '压轴': 0 };
  for (const q of questions) {
    dist[q.difficulty]++;
  }
  return dist;
}

export function computeYearlyQuestionCounts(questions: Question[]): { year: number; count: number }[] {
  const map = new Map<number, number>();
  for (const q of questions) {
    map.set(q.year, (map.get(q.year) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export function computeYearlyQuestionCountsByPaper(
  questions: Question[],
  paperTypes: PaperType[]
): { year: number; papers: Record<string, number> }[] {
  const years = [2022, 2023, 2024, 2025, 2026];
  return years.map((year) => {
    const papers: Record<string, number> = {};
    for (const pt of paperTypes) {
      papers[pt] = questions.filter((q) => q.year === year && q.paperType === pt).length;
    }
    return { year, papers };
  });
}

export function computeCategoryDistribution(
  questions: Question[],
  getCategory: (kpId: string) => string
): Record<string, number> {
  const dist: Record<string, number> = {};
  const seen = new Set<string>();
  for (const q of questions) {
    for (const kpId of q.knowledgePointIds) {
      const key = `${q.id}-${kpId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const cat = getCategory(kpId);
      dist[cat] = (dist[cat] || 0) + 1;
    }
  }
  return dist;
}

export interface KPYearlyFrequency {
  kpId: string;
  yearlyCounts: { year: number; count: number; proportion: number }[];
}

export function computeKPYearlyFrequency(
  kpId: string,
  questions: Question[],
  paperType?: PaperType
): KPYearlyFrequency {
  const years = [2022, 2023, 2024, 2025, 2026];
  const yearlyCounts = years.map((year) => {
    const yearQs = questions.filter(
      (q) => q.year === year && (!paperType || q.paperType === paperType)
    );
    const count = yearQs.filter((q) => q.knowledgePointIds.includes(kpId)).length;
    const proportion = yearQs.length > 0 ? count / yearQs.length : 0;
    return { year, count, proportion };
  });
  return { kpId, yearlyCounts };
}
