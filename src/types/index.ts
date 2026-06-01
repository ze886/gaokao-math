export type KnowledgeCategory =
  | '集合与逻辑'
  | '函数与导数'
  | '三角函数与解三角形'
  | '平面向量与复数'
  | '数列'
  | '立体几何'
  | '解析几何'
  | '概率与统计'
  | '计数原理与不等式';

export type PaperType = '全国甲卷' | '全国乙卷' | '新高考I卷' | '新高考II卷';
export type QuestionType = '单选题' | '多选题' | '填空题' | '解答题';
export type DifficultyLevel = '基础' | '中等' | '较难' | '压轴';
export type TrendDirection = 'rising' | 'stable' | 'declining';
export type ConfidenceLevel = '高' | '中' | '低';
export type TabId = 'dashboard' | 'classify' | 'predict' | 'knowledge';

export interface KnowledgePoint {
  id: string;
  name: string;
  category: KnowledgeCategory;
  parentId: string | null;
  syllabusWeight: number; // 1-10
  description: string;
  typicalQuestionTypes: QuestionType[];
}

export interface Question {
  id: string;
  year: number;
  paperType: PaperType;
  questionNumber: number;
  questionType: QuestionType;
  knowledgePointIds: string[];
  difficulty: DifficultyLevel;
  score: number;
  title: string;
  content: string;
  solutionHint: string;
  isExample: boolean;
}

export interface SyllabusWeight {
  knowledgePointId: string;
  examWeight: number; // 1-10
  estimatedProbability: number;
  notes: string;
}

export interface KnowledgePointPrediction {
  knowledgePointId: string;
  knowledgePointName: string;
  category: KnowledgeCategory;
  probability: number; // 0-1
  predictedQuestionTypes: {
    type: QuestionType;
    probability: number;
    predictedCount: number;
  }[];
  trend: TrendDirection;
  trendSlope: number;
  confidence: number; // 0-1
  historicalFrequency: number;
  syllabusPrior: number;
}

export interface FilterState {
  year: number | null;
  paperType: PaperType | null;
  knowledgePointId: string | null;
  difficulty: DifficultyLevel | null;
  questionType: QuestionType | null;
  searchQuery: string;
}

export type FilterAction =
  | { type: 'SET_YEAR'; payload: number | null }
  | { type: 'SET_PAPER_TYPE'; payload: PaperType | null }
  | { type: 'SET_KNOWLEDGE_POINT'; payload: string | null }
  | { type: 'SET_DIFFICULTY'; payload: DifficultyLevel | null }
  | { type: 'SET_QUESTION_TYPE'; payload: QuestionType | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'RESET' };
