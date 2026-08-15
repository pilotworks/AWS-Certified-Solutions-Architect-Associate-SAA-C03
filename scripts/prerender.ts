import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MODULES_METADATA } from '../src/data/modules-meta';
import { ServerApp } from '../src/app';
import { AUTHOR_NAME, AUTHOR_URL, getModuleOgImagePath, getOgImageUrl } from '../src/components/seo/seo-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

interface RouteConfig {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  schemaJson?: object;
  ogImagePath?: string;
}

const DOMAIN = process.env.SITE_URL || 'https://aws-saa-c03.pilotworks.dev';

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function enrichSchema(
  schemaJson: object | undefined,
  canonicalUrl: string,
  ogImageUrl: string,
): object | undefined {
  if (!schemaJson) return undefined;

  const schema = schemaJson as Record<string, unknown>;
  return {
    ...schema,
    ...(schema['@type'] === 'TechArticle'
      ? { author: { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL } }
      : {}),
    creator: { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL },
    inLanguage: 'en',
    image: ogImageUrl,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
  };
}

export function runStaticGenerator() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found. Please run "vite build" first.');
    process.exit(1);
  }

  const baseHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ dist/index.html not found.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // Define static routes with targeted SEO metadata
  const routes: RouteConfig[] = [
    {
      path: '/',
      title: 'AWS Certified Solutions Architect Associate (SAA-C03) Mastery Hub',
      description: 'Comprehensive AWS Solutions Architect Associate (SAA-C03) learning platform featuring 14 modules, interactive architecture diagrams, decision matrices, 3D flashcards, and exam simulators.',
      keywords: ['AWS', 'SAA-C03', 'Solutions Architect Associate', 'AWS Certification', 'Cloud Architecture'],
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'AWS Certified Solutions Architect - Associate (SAA-C03) Learning & Exam Hub',
        description: 'Complete preparation course covering all 14 AWS SAA-C03 domains, architectural patterns, interactive 3D flashcards, and timed practice exam simulator.',
        provider: { '@type': 'Organization', name: 'AWS SAA-C03 Learning Hub' },
        educationalCredentialAwarded: 'AWS Certified Solutions Architect - Associate',
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: 'PT14H' },
      },
    },
    {
      path: '/modules',
      title: 'AWS SAA-C03 Study Modules & Roadmap | AWS SAA-C03 Hub',
      description: 'Browse all 14 AWS Certified Solutions Architect Associate (SAA-C03) study modules, exam domains, learning objectives, and practice resources.',
      keywords: ['AWS SAA-C03 Modules', 'AWS Study Guide', 'Solutions Architect Roadmap'],
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'AWS SAA-C03 Study Modules and Roadmap',
        description: 'Fourteen structured study modules for AWS Certified Solutions Architect Associate preparation.',
        provider: { '@type': 'Organization', name: 'AWS SAA-C03 Learning Hub' },
      },
    },
    {
      path: '/architecture',
      title: 'AWS Architecture Patterns & Blueprints | SAA-C03 Hub',
      description: 'Interactive AWS architecture diagrams covering Multi-AZ web applications, serverless event-driven processing, data lakes, and cross-region disaster recovery.',
      keywords: ['AWS Architecture', 'Mermaid Diagrams', 'Multi-AZ', 'Serverless', 'Well-Architected'],
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'AWS SAA-C03 Architectural Patterns & Mermaid Diagrams',
        description: 'High-availability, disaster recovery, serverless, and decoupled reference architectures with interactive Mermaid vector diagrams.',
        articleSection: 'AWS Architecture',
        keywords: 'AWS Architecture, HA/DR, Serverless, Decoupled, SAA-C03, Mermaid diagrams',
      },
    },
    {
      path: '/cheatsheets',
      title: 'AWS Architecture Decision Matrices & Cheat Sheets | SAA-C03 Hub',
      description: 'High-yield AWS decision matrices comparing Compute, Storage, and Database services.',
      keywords: ['AWS Cheat Sheet', 'Decision Matrix'],
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'AWS Architecture Decision Matrices & Cheat Sheets',
        description: 'High-yield AWS decision matrices comparing Compute, Storage, and Database services.',
        articleSection: 'AWS Architecture',
      },
    },
    {
      path: '/flashcards',
      title: '3D High-Yield AWS Exam Flashcards | SAA-C03 Hub',
      description: 'Spaced repetition flashcards covering core SAA-C03 exam traps, metrics, service differences, and architectural limits.',
      keywords: ['AWS Flashcards', 'Exam Review', 'SAA-C03 Flashcards', 'Spaced Repetition'],
    },
    {
      path: '/exam-simulator',
      title: 'Full SAA-C03 Practice Exam Simulator | SAA-C03 Hub',
      description: 'Timed 65-question practice exam simulator adhering to official AWS SAA-C03 domain weightings, scoring criteria, and in-depth explanations.',
      keywords: ['AWS Exam Simulator', 'Practice Exam', '65 Questions', 'Timed Quiz'],
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: 'AWS SAA-C03 Full Practice Exam Simulator',
        description: 'Timed 65-question practice exam for AWS Solutions Architect Associate preparation.',
        educationalLevel: 'Intermediate',
      },
    },
  ];

  // Add all 14 modules
  MODULES_METADATA.forEach((mod) => {
    routes.push({
      path: `/modules/${mod.id}`,
      title: `Module ${mod.number < 10 ? '0' : ''}${mod.number}: ${mod.title} | AWS SAA-C03 Hub`,
      description: `Complete study guide for ${mod.title} (${mod.domain}) covering comprehensive theory, fast-track notes, vector diagrams, and ${mod.examWeight} exam questions.`,
      keywords: ['AWS', mod.title, mod.domain, 'SAA-C03', 'Study Guide'],
      ogImagePath: getModuleOgImagePath(mod.id),
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: `Module ${mod.number < 10 ? '0' : ''}${mod.number}: ${mod.title}`,
        description: `Complete AWS SAA-C03 guide for ${mod.title} covering architecture theory, fast-track summaries, vector diagrams, and practice questions.`,
        articleSection: mod.domain,
        keywords: `AWS, ${mod.title}, ${mod.domain}, SAA-C03, Solutions Architect`,
      },
    });
  });

  console.log('⚡ Running Static Site Pre-renderer (SSG) for all routes...\n');

  let count = 0;

  for (const route of routes) {
    let customHtml = baseHtml;

    // Inject title
      customHtml = customHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtmlAttribute(route.title)}</title>`);

    // Inject or update meta description
    if (customHtml.includes('name="description"')) {
      customHtml = customHtml.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${escapeHtmlAttribute(route.description)}" />`
      );
    } else {
      customHtml = customHtml.replace(
        '</head>',
        `  <meta name="description" content="${escapeHtmlAttribute(route.description)}" />\n</head>`
      );
    }

    // Inject Canonical & OpenGraph
    const canonicalUrl = `${DOMAIN}${route.path === '/' ? '' : route.path}`;
    const ogImageUrl = getOgImageUrl(DOMAIN, route.ogImagePath);
    const safeTitle = escapeHtmlAttribute(route.title);
    const safeDescription = escapeHtmlAttribute(route.description);
    const extraMeta = `
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="${route.path === '/' ? 'website' : 'article'}" />
  <meta property="og:site_name" content="AWS SAA-C03 Learning Hub" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:alt" content="AWS SAA-C03 Learning Hub" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${ogImageUrl}" />`;

    customHtml = customHtml.replace('</head>', `${extraMeta}\n</head>`);

    if (route.schemaJson) {
      const jsonLd = JSON.stringify(enrichSchema(route.schemaJson, canonicalUrl, ogImageUrl)).replace(/</g, '\\u003c');
      customHtml = customHtml.replace(
        '</head>',
        `  <script id="schema-org-jsonld" type="application/ld+json">${jsonLd}</script>\n</head>`
      );
    }

    // Render full React component tree for real SSR / SSG HTML
    try {
      const appHtml = renderToString(React.createElement(ServerApp, { initialUrl: route.path }));
      customHtml = customHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    } catch (renderError) {
      console.warn(`⚠️ Warning: Failed to renderToString for route ${route.path}:`, renderError);
    }

    // Write file to target route directory
    if (route.path === '/') {
      fs.writeFileSync(baseHtmlPath, customHtml, 'utf-8');
    } else {
      const targetDir = path.join(distDir, route.path.replace(/^\//, ''));
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, 'index.html'), customHtml, 'utf-8');
    }

    count++;
  }

  // Create 404.html for GitHub Pages / Cloudflare Pages SPA fallback
  fs.copyFileSync(baseHtmlPath, path.join(distDir, '404.html'));

  console.log(`✅ Pre-rendered static HTML files for ${count} routes + 404 fallback in dist/`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runStaticGenerator();
}
