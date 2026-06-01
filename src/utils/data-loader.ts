import type { Question, KnowledgePoint } from '../types';
import kpData from '../data/knowledge-points.json';

const questionModules = import.meta.glob<{ default: Question[] }>(
  '../data/questions-*.json',
  { eager: true }
);

export function loadAllQuestions(): Question[] {
  const questions: Question[] = [];
  for (const path of Object.keys(questionModules).sort()) {
    const mod = questionModules[path];
    const data = 'default' in mod ? mod.default : mod;
    if (Array.isArray(data)) {
      questions.push(...data as Question[]);
    }
  }
  return questions;
}

export function getKnowledgePoints(): KnowledgePoint[] {
  return kpData as unknown as KnowledgePoint[];
}

export function getKnowledgePointMap(): Map<string, KnowledgePoint> {
  const map = new Map<string, KnowledgePoint>();
  for (const kp of kpData as unknown as KnowledgePoint[]) {
    map.set(kp.id, kp);
  }
  return map;
}
