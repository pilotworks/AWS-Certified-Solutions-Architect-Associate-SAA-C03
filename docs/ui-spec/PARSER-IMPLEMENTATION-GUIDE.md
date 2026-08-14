# ⚙️ AWS Learning Hub - Markdown Parser Implementation Guide

> **Parent Spec**: [UI-ARCHITECTURE-SPEC.md](file:///Users/tienpham/Work/entj-pham/aws-learning/docs/ui-spec/UI-ARCHITECTURE-SPEC.md)  
> **Status**: Ready for Implementation  

This guide provides algorithms and TypeScript implementation examples for parsing the existing Markdown files into structured JSON data models for the web UI components.

---

## 1. Parsing Questions from `PRACTICE-QUESTIONS.md`

### Markdown Source Format:
```markdown
### Question 1
A company needs to host a static website with high availability and low latency globally...
Which solution meets these requirements at the lowest cost?

A. Host on Amazon EC2 instances across multiple AZs behind an ALB
B. Host on Amazon S3 and configure Amazon CloudFront distribution
C. Host on AWS Elastic Beanstalk
D. Store on Amazon EFS and mount to EC2

**Correct Answer**: B

**Explanation**:
Amazon S3 website hosting combined with Amazon CloudFront provides the lowest latency...
- Option A is incorrect because EC2 has higher compute costs and maintenance overhead.
- Option B is correct because S3 + CloudFront is serverless, highly available, and cheapest for static content.
```

### TypeScript Regex Parser:
```typescript
import { PracticeQuestion, QuizOption } from './types';

export function parsePracticeQuestions(markdownContent: string, moduleId: string): PracticeQuestion[] {
  const questionBlocks = markdownContent.split(/###\s+Question\s+(\d+)/i).slice(1);
  const questions: PracticeQuestion[] = [];

  for (let i = 0; i < questionBlocks.length; i += 2) {
    const questionNum = parseInt(questionBlocks[i], 10);
    const body = questionBlocks[i + 1];

    // Extract options
    const optionsMatch = body.match(/([A-F]\.\s+[^\n]+)/g) || [];
    const options: QuizOption[] = optionsMatch.map(opt => ({
      key: opt.charAt(0) as any,
      text: opt.substring(3).trim()
    }));

    // Extract correct answer(s)
    const answerMatch = body.match(/\*\*Correct Answer\*\*:\s*([A-F,\s]+)/i);
    const correctAnswers = answerMatch 
      ? answerMatch[1].split(',').map(s => s.trim() as any) 
      : [];

    // Extract explanation
    const explanationMatch = body.match(/\*\*Explanation\*\*:\s*([\s\S]+?)(?=(###|$))/i);
    const explanationText = explanationMatch ? explanationMatch[1].trim() : '';

    // Extract question scenario prior to Option A
    const scenario = body.split(/[A-F]\.\s+/)[0].trim();

    questions.push({
      id: `${moduleId}-q${questionNum}`,
      moduleId,
      questionNumber: questionNum,
      scenario,
      isMultiSelect: correctAnswers.length > 1,
      maxSelections: correctAnswers.length,
      options,
      correctAnswerKeys: correctAnswers,
      explanation: {
        general: explanationText,
        optionBreakdowns: {}
      },
      examKeywords: extractKeywords(scenario),
      difficulty: 'Moderate'
    });
  }

  return questions;
}

function extractKeywords(text: string): string[] {
  const targetKeywords = [
    'lowest cost', 'cost-effective', 'high availability', 'low latency', 
    'real-time', 'disaster recovery', 'serverless', 'decoupled', 'multi-region',
    'rto', 'rpo', 'cross-region', 'zero downtime'
  ];
  return targetKeywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(text));
}
```

---

## 2. Parsing Flashcards from `FLASHCARDS.md`

### Markdown Source Format:
```markdown
### 🃏 Card 1: EC2 Spot Instances
* **Front**: When should you use EC2 Spot Instances instead of On-Demand?
* **Back**: For workloads with flexible start and end times, batch processing, and fault-tolerant applications. Can save up to 90% cost.
* **Exam Tip**: Never use Spot for critical databases or uninterrupted workloads.
```

### TypeScript Parser:
```typescript
export function parseFlashcards(markdownContent: string): FlashcardItem[] {
  const cards: FlashcardItem[] = [];
  const cardBlocks = markdownContent.split(/###\s+.*Card\s+\d+:\s*([^\n]+)/i).slice(1);

  for (let i = 0; i < cardBlocks.length; i += 2) {
    const title = cardBlocks[i].trim();
    const body = cardBlocks[i + 1];

    const frontMatch = body.match(/\*\*Front\*\*:\s*([^\n]+)/i);
    const backMatch = body.match(/\*\*Back\*\*:\s*([^\n]+)/i);
    const tipMatch = body.match(/\*\*Exam Tip\*\*:\s*([^\n]+)/i);

    cards.push({
      id: `fc-${i}`,
      category: 'General',
      front: {
        title,
        scenario: frontMatch ? frontMatch[1].trim() : title
      },
      back: {
        solution: backMatch ? backMatch[1].trim() : '',
        keyPoints: [],
        avoidMistake: tipMatch ? tipMatch[1].trim() : undefined
      },
      tags: []
    });
  }

  return cards;
}
```

---

## 3. Dynamic Mermaid Diagram Rendering in React

Example React component integrating `mermaid` with dark theme styling:

```tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#0F172A',
    primaryColor: '#FF9900',
    primaryTextColor: '#F8FAFC',
    lineColor: '#38BDF8'
  }
});

interface MermaidViewerProps {
  chart: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return <div ref={containerRef} className="overflow-x-auto p-4 flex justify-center bg-slate-900 rounded-lg" />;
};
```
