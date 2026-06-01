import type { Question, KnowledgePointPrediction, PaperType, QuestionType } from '../types';
import { computeTrendScore } from './trend';
import { computeKPYearlyFrequency } from './statistics';
import { getKnowledgePoints } from './data-loader';

const WEIGHTS = {
  frequency: 0.40,
  trend: 0.35,
  syllabus: 0.25,
};

export function predictForPaperType(
  paperType: PaperType,
  questions: Question[]
): KnowledgePointPrediction[] {
  const allKPs = getKnowledgePoints();
  const paperQuestions = questions.filter((q) => q.paperType === paperType);
  const totalQuestions = paperQuestions.length;

  if (totalQuestions === 0) return [];

  const predictions: KnowledgePointPrediction[] = [];

  for (const kp of allKPs) {
    // 1. Frequency score
    const freqData = computeKPYearlyFrequency(kp.id, questions, paperType);
    const totalCount = freqData.yearlyCounts.reduce((s, d) => s + d.count, 0);
    const historicalFrequency = totalCount / Math.max(totalQuestions * 5, 1);

    // 2. Trend score
    const trendResult = computeTrendScore(freqData.yearlyCounts);

    // 3. Syllabus prior (normalize across all KPs)
    const totalWeight = allKPs.reduce((s, k) => s + k.syllabusWeight, 0);
    const syllabusPrior = kp.syllabusWeight / totalWeight;

    // Combined probability
    const probability =
      WEIGHTS.frequency * historicalFrequency * 10 + // scale up since frequency is usually small
      WEIGHTS.trend * trendResult.score +
      WEIGHTS.syllabus * syllabusPrior * 10;

    // Normalize to [0, 1]
    const normalizedProb = Math.min(Math.max(probability, 0), 1);

    // Predict question types
    const predictedQuestionTypes = predictQuestionTypes(kp.id, paperType, questions);

    // Confidence
    const confidence = computeConfidence(totalCount, 5);

    predictions.push({
      knowledgePointId: kp.id,
      knowledgePointName: kp.name,
      category: kp.category,
      probability: Math.round(normalizedProb * 1000) / 1000,
      predictedQuestionTypes,
      trend: trendResult.direction,
      trendSlope: Math.round(trendResult.slope * 10000) / 10000,
      confidence,
      historicalFrequency: Math.round(historicalFrequency * 1000) / 1000,
      syllabusPrior: Math.round(syllabusPrior * 1000) / 1000,
    });
  }

  return predictions.sort((a, b) => b.probability - a.probability);
}

function predictQuestionTypes(
  kpId: string,
  paperType: PaperType,
  questions: Question[]
): { type: QuestionType; probability: number; predictedCount: number }[] {
  const relevant = questions.filter(
    (q) => q.paperType === paperType && q.knowledgePointIds.includes(kpId)
  );

  const typeCounts: Record<string, number> = {};
  for (const q of relevant) {
    typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
  }

  const total = relevant.length;
  if (total === 0) return [];

  const types: QuestionType[] = ['单选题', '多选题', '填空题', '解答题'];
  return types
    .filter((t) => typeCounts[t])
    .map((type) => ({
      type,
      probability: Math.round((typeCounts[type] / total) * 100) / 100,
      predictedCount: Math.max(1, Math.round(typeCounts[type] / 5)),
    }))
    .sort((a, b) => b.probability - a.probability);
}

function computeConfidence(relevantCount: number, yearSpan: number): number {
  const dataFactor = Math.min(relevantCount / 15, 1);
  const timeFactor = Math.min(yearSpan / 5, 1);
  return Math.round(Math.min(0.3 + 0.65 * (0.6 * dataFactor + 0.4 * timeFactor), 0.95) * 100) / 100;
}

export function getConfidenceLabel(confidence: number): '高' | '中' | '低' {
  if (confidence >= 0.7) return '高';
  if (confidence >= 0.4) return '中';
  return '低';
}
