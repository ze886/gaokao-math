import type { PaperType, QuestionType, DifficultyLevel, KnowledgeCategory, TrendDirection, TabId } from '../types';

export const PAPER_TYPES: PaperType[] = ['全国甲卷', '全国乙卷', '新高考I卷', '新高考II卷'];
export const QUESTION_TYPES: QuestionType[] = ['单选题', '多选题', '填空题', '解答题'];
export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['基础', '中等', '较难', '压轴'];
export const YEARS = [2022, 2023, 2024, 2025, 2026];
export const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: '总览' },
  { id: 'classify', label: '真题分类' },
  { id: 'predict', label: '考点预测' },
  { id: 'knowledge', label: '知识点详情' },
];

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  '基础': 'bg-green-100 text-green-700 border-green-200',
  '中等': 'bg-blue-100 text-blue-700 border-blue-200',
  '较难': 'bg-amber-100 text-amber-700 border-amber-200',
  '压轴': 'bg-red-100 text-red-700 border-red-200',
};

export const DIFFICULTY_HEX: Record<DifficultyLevel, string> = {
  '基础': '#22c55e',
  '中等': '#3b82f6',
  '较难': '#f59e0b',
  '压轴': '#ef4444',
};

export const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
  '函数与导数': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  '解析几何': 'bg-violet-100 text-violet-700 border-violet-200',
  '概率与统计': 'bg-pink-100 text-pink-700 border-pink-200',
  '立体几何': 'bg-teal-100 text-teal-700 border-teal-200',
  '三角函数与解三角形': 'bg-orange-100 text-orange-700 border-orange-200',
  '数列': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '平面向量与复数': 'bg-lime-100 text-lime-700 border-lime-200',
  '计数原理与不等式': 'bg-purple-100 text-purple-700 border-purple-200',
  '集合与逻辑': 'bg-gray-100 text-gray-600 border-gray-200',
};

export const CATEGORY_HEX: Record<KnowledgeCategory, string> = {
  '函数与导数': '#6366f1',
  '解析几何': '#8b5cf6',
  '概率与统计': '#ec4899',
  '立体几何': '#14b8a6',
  '三角函数与解三角形': '#f97316',
  '数列': '#06b6d4',
  '平面向量与复数': '#84cc16',
  '计数原理与不等式': '#a855f7',
  '集合与逻辑': '#6b7280',
};

export const CATEGORY_ORDER: KnowledgeCategory[] = [
  '函数与导数',
  '解析几何',
  '概率与统计',
  '立体几何',
  '三角函数与解三角形',
  '数列',
  '平面向量与复数',
  '计数原理与不等式',
  '集合与逻辑',
];

export const TREND_COLORS: Record<TrendDirection, string> = {
  'rising': 'text-green-600',
  'stable': 'text-gray-500',
  'declining': 'text-red-500',
};

export const CONFIDENCE_COLORS: Record<string, string> = {
  '高': 'bg-green-100 text-green-700',
  '中': 'bg-amber-100 text-amber-700',
  '低': 'bg-gray-100 text-gray-500',
};
