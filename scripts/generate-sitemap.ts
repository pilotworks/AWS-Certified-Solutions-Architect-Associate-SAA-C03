import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = process.env.SITE_URL || 'https://aws-saa-c03.pilotworks.dev';

const MODULE_IDS = [
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

const STATIC_ROUTES = [
  '/',
  '/modules',
  ...MODULE_IDS.map((id) => `/modules/${id}`),
  '/architecture',
  '/exam-simulator',
  '/flashcards',
  '/cheatsheets',
];

export function generateSitemapAndRobots() {
  const publicDir = path.resolve(__dirname, '../public');
  const distDir = path.resolve(__dirname, '../dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(
  (route) => `  <url>
    <loc>${DOMAIN}${route === '/' ? '' : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.startsWith('/modules') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/modules') ? '0.8' : '0.7'}</priority>
  </url>`
).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log(`✅ Generated sitemap.xml with ${STATIC_ROUTES.length} routes for ${DOMAIN}`);

  // 2. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  }
  console.log('✅ Generated robots.txt');
}

generateSitemapAndRobots();
