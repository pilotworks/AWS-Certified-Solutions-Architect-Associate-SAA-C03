export type DomainType =
  | 'Fundamentals'
  | 'Compute'
  | 'Storage'
  | 'Database'
  | 'Networking'
  | 'Security'
  | 'Integration'
  | 'Management'
  | 'Migration'
  | 'Analytics'
  | 'Architecture'
  | 'Cost'
  | 'Practice';

export type StudyMode = 'all' | 'speedrun' | 'fasttrack' | 'deepdive';

export interface ModuleMeta {
  id: string; // e.g. "01-AWS-Fundamentals"
  slug: string; // e.g. "01-aws-fundamentals"
  number: number;
  title: string;
  domain: DomainType;
  icon: string;
  examWeight: string;
  timeEstimates: {
    deepDive: string;
    fastLearn: string;
    ultraFast: string;
  };
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface QuizOption {
  key: string;
  text: string;
}

export interface PracticeQuestion {
  id: string;
  moduleId: string;
  questionNumber: number;
  scenario: string;
  isMultiSelect: boolean;
  maxSelections: number;
  options: QuizOption[];
  correctAnswerKeys: string[];
  explanation: string;
  examKeywords: string[];
  difficulty: 'Foundation' | 'Moderate' | 'Hard';
}

export interface FlashcardItem {
  id: string;
  category: string;
  title: string;
  front: string;
  back: string;
  examTip?: string;
  tags: string[];
}

export interface UserProgressState {
  completedModules: string[];
  completedUltraFast: string[];
  completedFastLearn: string[];
  masteredFlashcards: string[];
  reviewFlashcards: string[];
  quizScores: Record<string, { total: number; score: number; date: number }>;
  bookmarkedQuestions: string[];
  userNotes: Record<string, string>;
  examHistory: {
    id: string;
    date: number;
    score: number;
    totalQuestions: number;
    timeSpentSeconds: number;
    domainBreakdown: Record<string, { correct: number; total: number }>;
  }[];
}

export type PatternType = 'HA_DR' | 'Decoupled' | 'Serverless' | 'MultiTier' | 'HybridNetwork';

export interface ArchitecturePattern {
  id: string;
  title: string;
  patternType: PatternType;
  domain: DomainType;
  scenario: string;
  rtoRequirement?: string;
  rpoRequirement?: string;
  diagramMermaid: string;
  recommendedServices: string[];
  tradeoffs: {
    cost: 'Low' | 'Medium' | 'High';
    complexity: 'Simple' | 'Moderate' | 'Complex';
    scalability: 'Standard' | 'Auto-Scaling' | 'Virtually Unlimited';
  };
  keyTakeaways: string[];
}

export interface DecisionMatrixItem {
  id: string;
  name: string;
  description: string;
  features: Record<string, string | boolean>;
  bestFor: string;
  avoidFor?: string;
  badge?: string;
}

export interface DecisionMatrixCategory {
  id: string;
  title: string;
  description: string;
  columns: { key: string; label: string }[];
  items: DecisionMatrixItem[];
}

