import mermaid from 'mermaid';
import { ARCHITECTURE_PATTERNS } from '../src/data/architecture-patterns';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

mermaid.initialize({ startOnLoad: false, suppressErrorRendering: true });

async function validateAll() {
  console.log('Testing architecture patterns...');
  for (const pat of ARCHITECTURE_PATTERNS) {
    try {
      await mermaid.parse(pat.diagramMermaid);
      console.log(`✅ Pattern ${pat.id}: OK`);
    } catch (e: any) {
      console.error(`❌ Pattern ${pat.id} FAILED:`, e.message);
    }
  }

  function findMdFiles(dir: string): string[] {
    let results: string[] = [];
    const list = readdirSync(dir);
    for (const file of list) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(findMdFiles(fullPath));
      } else if (file.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const docs = findMdFiles('docs');
  for (const doc of docs) {
    const content = readFileSync(doc, 'utf-8');
    const regex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let i = 0;
    while ((match = regex.exec(content)) !== null) {
      i++;
      const chart = match[1].trim();
      try {
        await mermaid.parse(chart);
      } catch (e: any) {
        console.error(`❌ File ${doc} diagram #${i} FAILED:\n${chart}\nError: ${e.message}\n---`);
      }
    }
  }
}

validateAll();
