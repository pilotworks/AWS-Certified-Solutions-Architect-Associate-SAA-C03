import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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
  let content = readFileSync(doc, 'utf-8');
  let original = content;

  // Fix known corrupt patterns like (Subnet( -> (Subnet)
  // Fix mismatched brackets like (packets per second[ -> (packets per second)
  content = content.replace(/```mermaid\n([\s\S]*?)```/g, (match, block) => {
    let fixedBlock = block;

    // Fix (xxx( in sequenceDiagram or flowchart
    fixedBlock = fixedBlock.replace(/\(([^()\n]+)\(/g, '($1)');
    fixedBlock = fixedBlock.replace(/\(([^()\n]+)\[/g, '($1)');
    fixedBlock = fixedBlock.replace(/\[([^\[\]\n]+)\(/g, '[$1]');
    fixedBlock = fixedBlock.replace(/\[([^\[\]\n]+)\{/g, '[$1]');

    return '```mermaid\n' + fixedBlock + '```';
  });

  if (content !== original) {
    console.log(`Fixing corrupted brackets in: ${doc}`);
    writeFileSync(doc, content, 'utf-8');
  }
}
