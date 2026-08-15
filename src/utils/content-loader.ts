import { PracticeQuestion, QuizOption, FlashcardItem } from '../types';
import { getCompiledDocContent } from '../data/modules-content';
import { MODULE_QUESTIONS_MAP, ALL_PRACTICE_QUESTIONS } from '../data/practice-questions';

// Vite static AST import.meta.glob for markdown files as fallback (SSR safe)
let rawDocs: Record<string, string> = {};
let relativeDocs: Record<string, string> = {};

try {
  if (typeof (import.meta as any).glob === 'function') {
    rawDocs = (import.meta as any).glob('/docs/**/*.md', {
      query: '?raw',
      eager: true,
      import: 'default',
    }) as Record<string, string>;

    relativeDocs = (import.meta as any).glob('../../docs/**/*.md', {
      query: '?raw',
      eager: true,
      import: 'default',
    }) as Record<string, string>;
  }
} catch {
  // Safe in Node.js SSR runtime
}

// Index all documents by normalized lowercase path (e.g. "01-aws-fundamentals/readme.md")
const fileMap = new Map<string, string>();

function indexFiles(files: Record<string, string>) {
  if (!files) return;
  for (const [key, value] of Object.entries(files)) {
    if (typeof value === 'string') {
      const cleanKey = key.replace(/^.*\/docs\//i, '').replace(/^\/+/, '').toLowerCase();
      fileMap.set(cleanKey, value);
    }
  }
}

indexFiles(rawDocs);
indexFiles(relativeDocs);

/**
 * Get raw markdown content by relative path under docs/
 * e.g. getDocContent('01-AWS-Fundamentals/README.md')
 */
export function getDocContent(relativePath: string): string {
  if (!relativePath) return '';
  const compiled = getCompiledDocContent(relativePath);
  if (compiled) return compiled;

  const cleanPath = relativePath.replace(/^.*\/docs\//i, '').replace(/^\/+/, '').toLowerCase();
  return fileMap.get(cleanPath) || '';
}

/**
 * Extract exam clue keywords from question scenario
 */
function extractKeywords(text: string): string[] {
  const targetKeywords = [
    'most cost-effective',
    'least operational overhead',
    'lowest latency',
    'high availability',
    'disaster recovery',
    'serverless',
    'stateless',
    'decoupled',
    'multi-region',
    'multi-az',
    'rto',
    'rpo',
    'sub-millisecond',
    'read replicas',
    'cross-region',
    'zero downtime',
    'encryption at rest',
    'least privilege',
    'fault tolerant',
    'auto scaling',
    'elasticity',
  ];

  return targetKeywords.filter((kw) =>
    new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
  );
}

/**
 * Parse practice questions from a module's PRACTICE-QUESTIONS.md content
 */
export function parsePracticeQuestions(
  markdownContent: string,
  moduleId: string
): PracticeQuestion[] {
  if (moduleId && MODULE_QUESTIONS_MAP[moduleId] && MODULE_QUESTIONS_MAP[moduleId].length > 0) {
    return MODULE_QUESTIONS_MAP[moduleId];
  }
  if (!markdownContent) return [];
  const questions: PracticeQuestion[] = [];

  // Match question blocks: ### Question X or ### Scenario X
  const rawBlocks = markdownContent.split(/^###\s+(?:Question|Scenario|\bQ)\s*(\d+)/gim).slice(1);

  for (let i = 0; i < rawBlocks.length; i += 2) {
    const questionNum = parseInt(rawBlocks[i], 10);
    const body = rawBlocks[i + 1] || '';

    // 1. Extract Options: A. Option text, B. Option text, etc.
    const optionLines = body.match(/^[A-F]\.\s+[^\n]+/gm) || [];
    let options: QuizOption[] = optionLines.map((opt) => ({
      key: opt.charAt(0).toUpperCase(),
      text: opt.substring(2).trim().replace(/^(?:-|:|\.)\s*/, ''),
    }));

    // If no line-start options found, fallback to inline matching
    if (options.length === 0) {
      const fallbackMatches = body.match(/([A-F])\.\s+([^A-F\n<]+)/g) || [];
      for (const m of fallbackMatches) {
        const key = m.charAt(0).toUpperCase();
        if (/^[A-F]$/.test(key)) {
          options.push({
            key,
            text: m.substring(2).trim().replace(/^(?:-|:|\.)\s*/, ''),
          });
        }
      }
    }

    // Check if options contain checkmarks like ✓, ✔, (Correct)
    const checkmarkKeys: string[] = [];
    options = options.map((opt) => {
      if (/[✓✔]|\(correct\)/i.test(opt.text)) {
        checkmarkKeys.push(opt.key);
        return {
          ...opt,
          text: opt.text.replace(/[✓✔]|\(correct\)/gi, '').trim(),
        };
      }
      return opt;
    });

    // 2. Extract Correct Answer(s): **Answer: B**, **Answer:** B, **Correct Answer: A, C**, etc.
    const answerMatch = body.match(/(?:\*\*|\b)(?:Correct\s+)?Answer\s*:\s*\*?\*?\s*([A-F,\s&and]+)/i);

    let correctAnswerKeys: string[] = [];
    if (answerMatch) {
      const rawAns = answerMatch[1];
      const matchedKeys = rawAns.match(/[A-F]/gi);
      if (matchedKeys) {
        correctAnswerKeys = Array.from(new Set(matchedKeys.map((k) => k.toUpperCase())));
      }
    }

    if (correctAnswerKeys.length === 0 && checkmarkKeys.length > 0) {
      correctAnswerKeys = checkmarkKeys;
    }

    // 3. Extract Explanation
    const explanationMatch =
      body.match(/\*\*Explanation:?\*\*\s*([\s\S]+?)(?=(\*\*References:?\*\*|<\/details>|###|---|$))/i) ||
      body.match(/Explanation:\s*([\s\S]+?)(?=(References:|<\/details>|###|---|$))/i);
    const explanation = explanationMatch ? explanationMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim() : '';

    // 4. Extract Question Scenario
    let scenario = '';
    const firstOptionIdx = body.search(/^[A-F]\.\s+/m);
    if (firstOptionIdx !== -1) {
      scenario = body.substring(0, firstOptionIdx).trim();
    } else {
      const inlineOptIdx = body.search(/[A-F]\.\s+/);
      if (inlineOptIdx !== -1) {
        scenario = body.substring(0, inlineOptIdx).trim();
      } else {
        scenario = body.split(/<details>/i)[0].trim();
      }
    }

    // Clean up scenario
    scenario = scenario
      .replace(/\*\*Scenario:?\*\*/i, '')
      .replace(/^[-*]\s+/gm, '')
      .trim();

    if (options.length >= 2 && correctAnswerKeys.length > 0) {
      questions.push({
        id: `${moduleId}-q${questionNum}`,
        moduleId,
        questionNumber: questionNum,
        scenario: scenario || `Question ${questionNum}`,
        isMultiSelect: correctAnswerKeys.length > 1,
        maxSelections: correctAnswerKeys.length,
        options,
        correctAnswerKeys,
        explanation: explanation || 'Refer to AWS Documentation & Well-Architected Framework.',
        examKeywords: extractKeywords(scenario),
        difficulty: questionNum > 20 ? 'Hard' : questionNum > 8 ? 'Moderate' : 'Foundation',
      });
    }
  }

  return questions;
}

/**
 * Parse flashcards from study-guides/FLASHCARDS.md
 */
export function parseFlashcards(markdownContent: string): FlashcardItem[] {
  if (!markdownContent) return [];
  const cards: FlashcardItem[] = [];

  // 1. Support Q&A format (**Q: ...** \n A: ...)
  if (markdownContent.includes('**Q:')) {
    const sections = markdownContent.split(/^##\s+/m).slice(1);
    let counter = 0;

    for (const section of sections) {
      const lines = section.trim().split('\n');
      const categoryRaw = lines[0].trim();
      if (categoryRaw.startsWith('🎯') || categoryRaw.startsWith('Table of Contents')) continue;

      let category = categoryRaw;
      if (/auto scaling|load balancing|compute/i.test(categoryRaw)) category = 'Compute';
      else if (/storage/i.test(categoryRaw)) category = 'Storage';
      else if (/database/i.test(categoryRaw)) category = 'Database';
      else if (/networking/i.test(categoryRaw)) category = 'Networking';
      else if (/monitoring|security/i.test(categoryRaw)) category = 'Security';
      else if (/analytics|machine learning/i.test(categoryRaw)) category = 'Analytics';
      else if (/migration/i.test(categoryRaw)) category = 'Migration';
      else if (/best practice/i.test(categoryRaw)) category = 'Architecture';

      const text = lines.slice(1).join('\n');
      const qaBlocks = text.split(/\*\*Q:\s*/i).slice(1);

      for (const block of qaBlocks) {
        const qEndIndex = block.indexOf('**');
        if (qEndIndex === -1) continue;

        const question = block.substring(0, qEndIndex).trim();
        const remainder = block.substring(qEndIndex + 2).trim();

        const aMatch = remainder.match(/^A:\s*([\s\S]+?)(?=(\*\*Q:|$|---))/i);
        if (!aMatch) continue;

        const answer = aMatch[1].trim();
        counter++;

        cards.push({
          id: `fc-qa-${counter}`,
          category,
          title: question.length > 50 ? question.substring(0, 47) + '...' : question,
          front: question,
          back: answer,
          examTip: `Core SAA-C03 concept for ${category}.`,
          tags: [category],
        });
      }
    }

    if (cards.length > 0) return cards;
  }

  // 2. Support Front/Back format
  const cardBlocks = markdownContent
    .split(/###\s*(?:[🃏\s]*Card|\d+\.|\bFlashcard)\s*[\d:]*\s*([^\n]+)/i)
    .slice(1);

  for (let i = 0; i < cardBlocks.length; i += 2) {
    const title = cardBlocks[i]?.trim() || `Card ${i / 2 + 1}`;
    const body = cardBlocks[i + 1] || '';

    const frontMatch = body.match(/\*\*Front\*\*:\s*([^\n]+)/i);
    const backMatch = body.match(/\*\*Back\*\*:\s*([\s\S]+?)(?=(\*\*Exam Tip\*\*|\*\*Tip\*\*|###|---|$))/i);
    const tipMatch = body.match(/\*\*(?:Exam )?Tip\*\*:\s*([^\n]+)/i);
    const categoryMatch = body.match(/\*\*Category\*\*:\s*([^\n]+)/i);

    let category = categoryMatch ? categoryMatch[1].trim() : 'General';
    if (category === 'General') {
      if (/s3|ebs|efs|fsx|storage/i.test(title + body)) category = 'Storage';
      else if (/ec2|lambda|fargate|ecs|eks|compute/i.test(title + body)) category = 'Compute';
      else if (/rds|dynamodb|aurora|elasticache|database/i.test(title + body)) category = 'Database';
      else if (/vpc|route 53|cloudfront|gateway|nat|transit/i.test(title + body)) category = 'Networking';
      else if (/iam|kms|waf|shield|security|secrets/i.test(title + body)) category = 'Security';
      else if (/sqs|sns|eventbridge|step function/i.test(title + body)) category = 'Integration';
      else if (/cloudwatch|cloudtrail|config/i.test(title + body)) category = 'Monitoring';
      else if (/kinesis|athena|glue|redshift/i.test(title + body)) category = 'Analytics';
      else if (/dr|rto|rpo|high availability/i.test(title + body)) category = 'Architecture';
    }

    const front = frontMatch ? frontMatch[1].trim() : title;
    const back = backMatch ? backMatch[1].trim() : body.trim();

    if (front && back) {
      cards.push({
        id: `fc-${i / 2 + 1}`,
        category,
        title,
        front,
        back,
        examTip: tipMatch ? tipMatch[1].trim() : undefined,
        tags: [category],
      });
    }
  }

  return cards;
}

/**
 * Get all questions aggregated from all 14 modules
 */
export function getAllQuestions(): PracticeQuestion[] {
  if (ALL_PRACTICE_QUESTIONS && ALL_PRACTICE_QUESTIONS.length > 0) {
    return ALL_PRACTICE_QUESTIONS;
  }

  const all: PracticeQuestion[] = [];
  const moduleIds = [
    '01-AWS-Fundamentals',
    '02-IAM',
    '03-Compute',
    '04-Storage',
    '05-Database',
    '06-Networking',
    '07-Security',
    '08-Application-Integration',
    '09-Monitoring',
    '10-Migration',
    '11-Analytics',
    '12-Architecture-Patterns',
    '13-Cost-Optimization',
    '14-Practice',
  ];

  moduleIds.forEach((modId) => {
    const raw = getDocContent(`${modId}/PRACTICE-QUESTIONS.md`);
    const parsed = parsePracticeQuestions(raw, modId);
    all.push(...parsed);
  });

  return all;
}
