import type { TrendDirection } from '../types';

export interface TrendResult {
  score: number;    // 0-1 normalized trend score
  slope: number;    // raw slope from linear regression
  direction: TrendDirection;
}

export function computeTrendScore(
  yearlyProportions: { year: number; proportion: number }[]
): TrendResult {
  const n = yearlyProportions.length;
  if (n < 2) return { score: 0.5, slope: 0, direction: 'stable' };

  const sumX = yearlyProportions.reduce((s, d) => s + d.year, 0);
  const sumY = yearlyProportions.reduce((s, d) => s + d.proportion, 0);
  const sumXY = yearlyProportions.reduce((s, d) => s + d.year * d.proportion, 0);
  const sumX2 = yearlyProportions.reduce((s, d) => s + d.year * d.year, 0);

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;

  // Sigmoid normalization: map slope to [0, 1]
  const score = 1 / (1 + Math.exp(-50 * slope));

  let direction: TrendDirection;
  if (slope > 0.01) direction = 'rising';
  else if (slope < -0.01) direction = 'declining';
  else direction = 'stable';

  return { score, slope, direction };
}

export function computeTrendPoints(
  yearlyProportions: { year: number; proportion: number }[]
): { year: number; value: number }[] {
  if (yearlyProportions.length < 2) return yearlyProportions.map((d) => ({ year: d.year, value: d.proportion }));

  const n = yearlyProportions.length;
  const sumX = yearlyProportions.reduce((s, d) => s + d.year, 0);
  const sumY = yearlyProportions.reduce((s, d) => s + d.proportion, 0);
  const sumXY = yearlyProportions.reduce((s, d) => s + d.year * d.proportion, 0);
  const sumX2 = yearlyProportions.reduce((s, d) => s + d.year * d.year, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return yearlyProportions.map((d) => ({
    year: d.year,
    value: slope * d.year + intercept,
  }));
}
