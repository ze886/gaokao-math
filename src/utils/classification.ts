import type { Question, FilterState, PaperType, KnowledgeCategory } from '../types';

export function filterQuestions(questions: Question[], filters: FilterState): Question[] {
  return questions.filter((q) => {
    if (filters.year !== null && q.year !== filters.year) return false;
    if (filters.paperType !== null && q.paperType !== filters.paperType) return false;
    if (filters.difficulty !== null && q.difficulty !== filters.difficulty) return false;
    if (filters.questionType !== null && q.questionType !== filters.questionType) return false;
    if (filters.knowledgePointId !== null && !q.knowledgePointIds.includes(filters.knowledgePointId)) return false;
    if (filters.searchQuery) {
      const q_ = filters.searchQuery.toLowerCase();
      if (!q.title.toLowerCase().includes(q_) && !q.content.toLowerCase().includes(q_)) return false;
    }
    return true;
  });
}

export function groupByYear(questions: Question[]): Map<number, Question[]> {
  const map = new Map<number, Question[]>();
  for (const q of questions) {
    const list = map.get(q.year) || [];
    list.push(q);
    map.set(q.year, list);
  }
  return map;
}

export function groupByPaperType(questions: Question[]): Map<PaperType, Question[]> {
  const map = new Map<PaperType, Question[]>();
  for (const q of questions) {
    const list = map.get(q.paperType) || [];
    list.push(q);
    map.set(q.paperType, list);
  }
  return map;
}

export function groupByKnowledgePoint(questions: Question[]): Map<string, Question[]> {
  const map = new Map<string, Question[]>();
  for (const q of questions) {
    for (const kpId of q.knowledgePointIds) {
      const list = map.get(kpId) || [];
      list.push(q);
      map.set(kpId, list);
    }
  }
  return map;
}

export function groupByCategory(questions: Question[], getCategory: (kpId: string) => KnowledgeCategory): Map<KnowledgeCategory, Question[]> {
  const map = new Map<KnowledgeCategory, Question[]>();
  const seen = new Set<string>();
  for (const q of questions) {
    for (const kpId of q.knowledgePointIds) {
      const key = `${q.id}-${kpId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const cat = getCategory(kpId);
      const list = map.get(cat) || [];
      list.push(q);
      map.set(cat, list);
    }
  }
  return map;
}

export function sortQuestions(questions: Question[], by: 'year' | 'difficulty' | 'questionNumber' = 'year'): Question[] {
  const difficultyOrder: Record<string, number> = { '基础': 0, '中等': 1, '较难': 2, '压轴': 3 };
  return [...questions].sort((a, b) => {
    if (by === 'year') return a.year - b.year || a.questionNumber - b.questionNumber;
    if (by === 'difficulty') return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    return a.questionNumber - b.questionNumber;
  });
}
