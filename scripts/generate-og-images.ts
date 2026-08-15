import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { MODULES_METADATA } from '../src/data/modules-meta';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');
const outputDir = path.join(rootDir, 'public/og-images/modules');

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapTitle(title: string): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > 28 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function createSvg(module: (typeof MODULES_METADATA)[number]): string {
  const number = String(module.number).padStart(2, '0');
  const titleLines = wrapTitle(module.title);
  const titleMarkup = titleLines
    .map(
      (line, index) =>
        `<text x="170" y="${315 + index * 72}" fill="#F8FAFC" font-family="Arial" font-size="58" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#090A0F"/>
  <rect x="70" y="70" width="1060" height="490" rx="30" fill="#12141F" stroke="#F59E0B" stroke-width="3"/>
  <rect x="110" y="130" width="16" height="360" fill="#F59E0B"/>
  <text x="170" y="205" fill="#F59E0B" font-family="Arial" font-size="30" font-weight="700" letter-spacing="4">AWS SAA-C03 MODULE ${number}</text>
  ${titleMarkup}
  <text x="170" y="465" fill="#CBD5E1" font-family="Arial" font-size="30">${escapeXml(module.domain)} • Exam weight ${escapeXml(module.examWeight)}</text>
  <text x="170" y="510" fill="#64748B" font-family="Arial" font-size="23">AWS Solutions Architect Associate Learning Hub</text>
</svg>`;
}

function convertSvgToPng(svg: string, outputPath: string): void {
  const converter = ['rsvg-convert', 'magick', 'convert'].find((command) => {
    const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
    return result.status === 0;
  });

  if (!converter) {
    throw new Error('rsvg-convert or ImageMagick is required to generate module OG PNGs.');
  }

  const args = converter === 'rsvg-convert'
    ? ['-o', outputPath, '-']
    : ['svg:-', '-background', '#090A0F', `png:${outputPath}`];
  const result = spawnSync(converter, args, {
    input: svg,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Failed to generate ${outputPath}`);
  }
}

export function generateOgImages(): void {
  fs.mkdirSync(outputDir, { recursive: true });

  for (const module of MODULES_METADATA) {
    const outputPath = path.join(outputDir, `${module.id}.png`);
    convertSvgToPng(createSvg(module), outputPath);
  }

  console.log(`Generated ${MODULES_METADATA.length} module OG images in public/og-images/modules/`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateOgImages();
}
