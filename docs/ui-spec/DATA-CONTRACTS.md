# 📜 AWS Learning Hub - Data Contracts & Type Definitions

> **Parent Spec**: [UI-ARCHITECTURE-SPEC.md](./UI-ARCHITECTURE-SPEC.md)  
> **Status**: Ready for Implementation  

---

## 1. Module & Content Contracts

```typescript
export type ModuleDomain = 
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

export interface AWSModule {
  id: string;              // e.g. "01-AWS-Fundamentals"
  number: number;          // 1 .. 14
  title: string;           // "AWS Fundamentals"
  domain: ModuleDomain;
  estimatedMinutes: {
    deepDive: number;
    fastLearn: number;
    ultraFast: number;
  };
  examWeightPercentage: number; // e.g. 15
  iconName: string;
  files: {
    readme: string;        // Path to README.md
    fastLearn: string;     // Path to FAST-LEARN.md
    ultraFast: string;     // Path to ULTRA-FAST-LEARN.md
    diagrams: string;      // Path to DIAGRAMS.md
    practice: string;      // Path to PRACTICE-QUESTIONS.md
  };
}
```

---

## 2. Quiz & Question Contracts

```typescript
export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  text: string;
}

export interface PracticeQuestion {
  id: string;              // e.g. "mod-03-q-12"
  moduleId: string;        // e.g. "03-Compute"
  questionNumber: number;  // e.g. 12
  scenario: string;        // Markdown content of question
  isMultiSelect: boolean;
  maxSelections?: number;  // 1 by default, 2 or 3 for "Select TWO" / "Select THREE"
  options: QuizOption[];
  correctAnswerKeys: ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[];
  explanation: {
    general: string;
    optionBreakdowns: {
      [key: string]: {
        isCorrect: boolean;
        reason: string;
      };
    };
  };
  examKeywords: string[];  // e.g. ["lowest latency", "serverless", "stateless"]
  difficulty: 'Foundation' | 'Moderate' | 'Hard';
}
```

---

## 3. Flashcard Contracts

```typescript
export interface FlashcardItem {
  id: string;              // e.g. "fc-compute-001"
  category: string;        // "EC2", "Lambda", "S3", "VPC"...
  front: {
    title: string;
    scenario: string;
    hint?: string;
  };
  back: {
    solution: string;      // e.g. "Amazon S3 Glacier Flexible Retrieval"
    keyPoints: string[];   // Key facts to remember
    avoidMistake?: string; // Common trap in exam
  };
  tags: string[];
}
```

---

## 4. Architecture Pattern Contracts

```typescript
export interface ArchitecturePattern {
  id: string;
  title: string;
  patternType: 'HA_DR' | 'Decoupled' | 'Serverless' | 'MultiTier' | 'HybridNetwork';
  scenario: string;
  rtoRequirement?: string; // e.g. "< 15 minutes"
  rpoRequirement?: string; // e.g. "0 (Real-time)"
  diagramMermaid: string;
  recommendedServices: string[];
  tradeoffs: {
    cost: 'Low' | 'Medium' | 'High';
    complexity: 'Simple' | 'Moderate' | 'Complex';
    scalability: 'Standard' | 'Auto-Scaling' | 'Virtually Unlimited';
  };
}
```
