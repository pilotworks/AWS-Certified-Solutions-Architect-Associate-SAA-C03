import React, { useEffect } from 'react';
import { AUTHOR_NAME, AUTHOR_URL, SITE_URL, getCanonicalUrl, getOgImageUrl } from './seo-config';

export interface PageHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  schemaJson?: object;
}

export const PageHead: React.FC<PageHeadProps> = ({
  title,
  description = 'Complete self-paced preparation course covering all 14 AWS SAA-C03 domains, architectural patterns, and practice exams.',
  keywords = ['AWS', 'SAA-C03', 'Solutions Architect', 'Cloud Architecture', 'AWS Certification'],
  canonicalPath = '',
  schemaJson,
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | AWS Solutions Architect Associate (SAA-C03) Hub`;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords.join(', ');

    // 4. Update Open Graph Tags
    const updateOG = (property: string, content: string) => {
      let og = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.content = content;
    };

    const siteUrl = import.meta.env.VITE_SITE_URL || SITE_URL;
    const canonicalUrl = getCanonicalUrl(canonicalPath, siteUrl);
    const ogImageUrl = getOgImageUrl(siteUrl);

    updateOG('og:title', fullTitle);
    updateOG('og:description', description);
    updateOG('og:url', canonicalUrl);
    updateOG('og:type', canonicalPath === '/' || canonicalPath === '' ? 'website' : 'article');
    updateOG('og:site_name', 'AWS SAA-C03 Learning Hub');
    updateOG('og:image', ogImageUrl);
    updateOG('og:image:alt', 'AWS SAA-C03 Learning Hub');
    updateOG('og:image:width', '1200');
    updateOG('og:image:height', '630');
    updateOG('og:image:type', 'image/png');

    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'index, follow';

    const updateTwitter = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateTwitter('twitter:card', 'summary_large_image');
    updateTwitter('twitter:title', fullTitle);
    updateTwitter('twitter:description', description);
    updateTwitter('twitter:image', ogImageUrl);

    // Canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // 5. Update Schema.org JSON-LD Structured Data
    if (schemaJson) {
      let script = document.getElementById('schema-org-jsonld') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'schema-org-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      const schema = schemaJson as Record<string, unknown>;
      script.textContent = JSON.stringify(
        {
          ...schemaJson,
          author: schema['@type'] === 'TechArticle'
            ? { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL }
            : undefined,
          creator: { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL },
          inLanguage: 'en',
          image: ogImageUrl,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl,
        },
        null,
        2,
      );
    } else {
      document.getElementById('schema-org-jsonld')?.remove();
    }
  }, [title, description, keywords, canonicalPath, schemaJson]);

  return null;
};
