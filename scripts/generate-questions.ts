import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PracticeQuestion, QuizOption } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const targetFile = path.join(rootDir, 'src', 'data', 'practice-questions.ts');

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

export function parsePracticeQuestionsFromContent(
  markdownContent: string,
  moduleId: string
): PracticeQuestion[] {
  if (!markdownContent) return [];
  const questions: PracticeQuestion[] = [];

  const rawBlocks = markdownContent.split(/^###\s+(?:Question|Scenario|\bQ)\s*(\d+)/gim).slice(1);

  for (let i = 0; i < rawBlocks.length; i += 2) {
    const questionNum = parseInt(rawBlocks[i], 10);
    const body = rawBlocks[i + 1] || '';

    // 1. Options
    const optionLines = body.match(/^[A-F]\.\s+[^\n]+/gm) || [];
    let options: QuizOption[] = optionLines.map((opt) => ({
      key: opt.charAt(0).toUpperCase(),
      text: opt.substring(2).trim().replace(/^[-:.]\s*/, ''),
    }));

    if (options.length === 0) {
      const fallbackMatches = body.match(/([A-F])\.\s+([^A-F\n<]+)/g) || [];
      for (const m of fallbackMatches) {
        const key = m.charAt(0).toUpperCase();
        if (/^[A-F]$/.test(key)) {
          options.push({
            key,
            text: m.substring(2).trim().replace(/^[-:.]\s*/, ''),
          });
        }
      }
    }

    // Checkmarks
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

    // 2. Answer
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

    // 3. Explanation
    const explanationMatch =
      body.match(/\*\*Explanation:?\*\*\s*([\s\S]+?)(?=(\*\*References:?\*\*|<\/details>|###|---|$))/i) ||
      body.match(/Explanation:\s*([\s\S]+?)(?=(References:|<\/details>|###|---|$))/i);
    const explanation = explanationMatch ? explanationMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim() : '';

    // 4. Scenario
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

export function generateQuestions() {
  const moduleFolders = fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{2}-/.test(d.name))
    .map((d) => d.name)
    .sort();

  const allQuestions: Record<string, PracticeQuestion[]> = {};
  let total = 0;

  for (const mod of moduleFolders) {
    const qPath = path.join(docsDir, mod, 'PRACTICE-QUESTIONS.md');
    if (fs.existsSync(qPath)) {
      const rawContent = fs.readFileSync(qPath, 'utf-8');
      const questions = parsePracticeQuestionsFromContent(rawContent, mod);
      allQuestions[mod] = questions;
      total += questions.length;
    } else {
      allQuestions[mod] = [];
    }
  }

  const fileContent = `// -------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED by scripts/generate-questions.ts
// DO NOT EDIT MANUALLY. Source of truth is docs/*/PRACTICE-QUESTIONS.md.
// Run "npm run data:generate" to re-generate this file.
// -------------------------------------------------------------------------

import { PracticeQuestion } from '../types';

export const MODULE_QUESTIONS_MAP: Record<string, PracticeQuestion[]> = ${JSON.stringify(allQuestions, null, 2)};

export const ALL_PRACTICE_QUESTIONS: PracticeQuestion[] = Object.values(MODULE_QUESTIONS_MAP).flat();
`;

  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  console.log(`✅ Successfully generated ${total} practice questions in ${path.relative(rootDir, targetFile)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateQuestions();
}
