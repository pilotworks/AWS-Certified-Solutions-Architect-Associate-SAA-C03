import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MermaidViewer } from '../architecture/mermaid-viewer';
import {
  Copy,
  Check,
  Info,
  Lightbulb,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  CheckSquare,
  Square,
  ExternalLink,
} from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return (
      <div className="italic py-8 opacity-60 text-sm" style={{ color: 'var(--text-muted)' }}>
        No content available.
      </div>
    );
  }

  const blocks = parseMarkdown(content);

  return (
    <div
      className={`space-y-4 leading-relaxed text-sm md:text-base selection:bg-amber-500/20 max-w-none ${className}`}
      style={{ color: 'var(--text-primary)' }}
    >
      {blocks}
    </div>
  );
};

// ==========================================
// BLOCK PARSER
// ==========================================

function parseMarkdown(md: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // 2. Fenced Code Block / Mermaid
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].startsWith('```')) {
        i++; // consume closing ```
      }
      const rawCode = codeLines.join('\n');

      if (lang === 'mermaid') {
        nodes.push(<MermaidViewer key={`mermaid-${i}`} chart={rawCode} />);
      } else {
        nodes.push(<CodeBlock key={`code-${i}`} code={rawCode} language={lang} />);
      }
      continue;
    }

    // 3. GitHub Callout Alerts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
    const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (alertMatch) {
      const alertType = alertMatch[1].toUpperCase() as 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
      const bodyLines: string[] = [];
      i++;
      while (i < lines.length && (lines[i].startsWith('>') || !lines[i].trim())) {
        if (lines[i].startsWith('>')) {
          bodyLines.push(lines[i].replace(/^>\s?/, ''));
        }
        i++;
      }
      nodes.push(
        <AlertBlock
          key={`alert-${i}`}
          type={alertType}
          content={bodyLines.join('\n').trim()}
        />
      );
      continue;
    }

    // 4. Standard Blockquote: > text
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i].startsWith('>') || !lines[i].trim())) {
        if (lines[i].startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
        }
        i++;
      }
      nodes.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 pl-4 py-2 my-3 rounded-r italic text-sm md:text-base leading-relaxed"
          style={{
            borderLeftColor: 'var(--text-accent)',
            backgroundColor: 'var(--accent-bg)',
            color: 'var(--text-secondary)',
          }}
        >
          {parseInline(quoteLines.join(' ').trim())}
        </blockquote>
      );
      continue;
    }

    // 5. Headings: # H1 ... ###### H6
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      nodes.push(<HeadingBlock key={`heading-${i}`} level={level} text={text} />);
      i++;
      continue;
    }

    // 6. Horizontal Rule: ---, ***, ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      nodes.push(
        <hr
          key={`hr-${i}`}
          className="my-6 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        />
      );
      i++;
      continue;
    }

    // 7. GFM Tables: must have header and separator line
    if (
      line.includes('|') &&
      lines[i + 1] &&
      lines[i + 1].includes('|') &&
      /^\s*\|?\s*[-:]+[-| :]*\s*$/.test(lines[i + 1])
    ) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(<TableBlock key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // 8. Lists (Unordered, Ordered, Task lists)
    if (/^(\*|-|\+|\d+\.)\s+/.test(line)) {
      const isOrdered = /^\d+\.\s+/.test(line);
      const listItems: { text: string; checked?: boolean }[] = [];

      while (i < lines.length && /^(\*|-|\+|\d+\.)\s+/.test(lines[i])) {
        const itemRaw = lines[i].replace(/^(\*|-|\+|\d+\.)\s+/, '');
        const taskMatch = itemRaw.match(/^\[([ xX])\]\s+(.*)$/);

        if (taskMatch) {
          listItems.push({
            text: taskMatch[2],
            checked: taskMatch[1].toLowerCase() === 'x',
          });
        } else {
          listItems.push({ text: itemRaw });
        }
        i++;
      }

      nodes.push(
        isOrdered ? (
          <ol
            key={`ol-${i}`}
            className="list-decimal list-inside space-y-2 my-3 pl-1 text-sm md:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span style={{ color: 'var(--text-primary)' }}>{parseInline(item.text)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul key={`ul-${i}`} className="space-y-2 my-3 pl-1 text-sm md:text-base">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                {item.checked !== undefined ? (
                  item.checked ? (
                    <CheckSquare
                      className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500"
                    />
                  ) : (
                    <Square
                      className="w-4 h-4 mt-0.5 shrink-0 opacity-40"
                      style={{ color: 'var(--text-muted)' }}
                    />
                  )
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                    style={{ backgroundColor: 'var(--text-accent)' }}
                  />
                )}
                <span
                  className={item.checked ? 'line-through opacity-70' : ''}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {parseInline(item.text)}
                </span>
              </li>
            ))}
          </ul>
        )
      );
      continue;
    }

    // 9. Paragraph / Fallback: ALWAYS consumes at least 1 line
    const paraLines: string[] = [line.trim()];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('>') &&
      !/^(\*|-|\+|\d+\.)\s+/.test(lines[i]) &&
      !/^(\*{3,}|-{3,}|_{3,})$/.test(lines[i].trim()) &&
      !(lines[i].includes('|') && lines[i + 1] && /^\s*\|?\s*[-:]+[-| :]*\s*$/.test(lines[i + 1]))
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    nodes.push(
      <p key={`p-${i}`} className="my-3 leading-relaxed text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>
        {parseInline(paraLines.join(' '))}
      </p>
    );
  }

  return nodes;
}

// ==========================================
// INLINE & LINK NORMALIZATION
// ==========================================

export function normalizeMarkdownLink(rawUrl: string): { url: string; isInternal: boolean } {
  if (!rawUrl) return { url: '#', isInternal: true };

  // Strip localhost / port if present
  let cleaned = rawUrl.replace(/^https?:\/\/localhost(?::\d+)?/i, '').trim();

  // External URLs (http/https/mailto)
  if (/^https?:\/\//i.test(cleaned) || /^mailto:/i.test(cleaned)) {
    return { url: cleaned, isInternal: false };
  }

  // Relative or root module links: e.g. "../11-Analytics/README.md", "/11-Analytics/README.md", "11-Analytics/FAST-LEARN.md"
  const moduleMatch = cleaned.match(/(?:(?:\.\.\/|\.\/|\/|^))(\d{2}-[^/#?]+)(?:\/([^#?]+))?(?:#([^?]*))?/i);
  if (moduleMatch) {
    const moduleId = moduleMatch[1];
    const file = (moduleMatch[2] || '').toLowerCase();
    const hash = moduleMatch[3] ? `#${moduleMatch[3]}` : '';

    let tab = 'overview';
    if (file.includes('fast-learn') || file.includes('ultra-fast')) {
      tab = 'fast';
    } else if (file.includes('diagram')) {
      tab = 'diagrams';
    } else if (file.includes('practice-question') || file.includes('quiz')) {
      tab = 'quiz';
    }

    return {
      url: `/modules/${moduleId}?tab=${tab}${hash}`,
      isInternal: true,
    };
  }

  // In-module tab links: e.g. "./FAST-LEARN.md", "./PRACTICE-QUESTIONS.md"
  if (/^\.?\/?(FAST-LEARN|ULTRA-FAST-LEARN|DIAGRAMS|PRACTICE-QUESTIONS|README)\.md/i.test(cleaned)) {
    const file = cleaned.toLowerCase();
    let tab = 'overview';
    if (file.includes('fast-learn') || file.includes('ultra-fast')) {
      tab = 'fast';
    } else if (file.includes('diagram')) {
      tab = 'diagrams';
    } else if (file.includes('practice-question')) {
      tab = 'quiz';
    }
    return {
      url: `?tab=${tab}`,
      isInternal: true,
    };
  }

  // App features routes
  if (/flashcard/i.test(cleaned)) return { url: '/flashcards', isInternal: true };
  if (/cheat-sheet|matrix|matrices/i.test(cleaned)) return { url: '/cheat-sheets', isInternal: true };
  if (/exam-sim|simulator/i.test(cleaned)) return { url: '/exam-simulator', isInternal: true };
  if (/architecture/i.test(cleaned)) return { url: '/architecture', isInternal: true };
  if (/dashboard/i.test(cleaned)) return { url: '/', isInternal: true };

  // Anchor hash
  if (cleaned.startsWith('#')) return { url: cleaned, isInternal: true };

  return { url: cleaned, isInternal: true };
}

export function parseInline(text: string): React.ReactNode {
  if (!text) return null;

  // Tokenize inline markdown patterns: code, bold-italic, bold, italic, links, images
  const regex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_|~~[^~]+~~|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\))/g;
  const elements: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      elements.push(text.substring(lastIdx, match.index));
    }

    const token = match[0];
    const key = `inline-${match.index}`;

    if (token.startsWith('`') && token.endsWith('`')) {
      // Inline Code
      elements.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded font-mono text-xs font-medium inline-block"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-accent)',
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('***') && token.endsWith('***')) {
      // Bold + Italic
      elements.push(
        <strong key={key} className="font-bold italic" style={{ color: 'var(--text-primary)' }}>
          {token.slice(3, -3)}
        </strong>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      // Bold
      elements.push(
        <strong key={key} className="font-bold" style={{ color: 'var(--text-primary)' }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('__') && token.endsWith('__')) {
      // Bold (underline syntax)
      elements.push(
        <strong key={key} className="font-bold" style={{ color: 'var(--text-primary)' }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
      // Italic
      elements.push(
        <em key={key} className="italic" style={{ color: 'var(--text-secondary)' }}>
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      // Strikethrough
      elements.push(
        <del key={key} className="line-through opacity-70">
          {token.slice(2, -2)}
        </del>
      );
    } else if (token.startsWith('![') && token.includes('](')) {
      // Image
      const alt = token.substring(2, token.indexOf(']('));
      const src = token.substring(token.indexOf('](') + 2, token.length - 1);
      elements.push(
        <img
          key={key}
          src={src}
          alt={alt}
          className="rounded-lg max-w-full my-3 border shadow-sm"
          style={{ borderColor: 'var(--border-subtle)' }}
        />
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      // Link
      const label = token.substring(1, token.indexOf(']('));
      const rawUrl = token.substring(token.indexOf('](') + 2, token.length - 1);
      const { url, isInternal } = normalizeMarkdownLink(rawUrl);

      if (isInternal) {
        elements.push(
          <Link
            key={key}
            to={url}
            className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
            style={{ color: 'var(--text-accent)' }}
          >
            <span>{label}</span>
          </Link>
        );
      } else {
        elements.push(
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
            style={{ color: 'var(--text-accent)' }}
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
          </a>
        );
      }
    }

    lastIdx = regex.lastIndex;
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }

  if (lastIdx < text.length) {
    elements.push(text.substring(lastIdx));
  }

  return <>{elements}</>;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden my-4 border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 border-b text-xs font-mono select-none"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <span className="uppercase tracking-wider font-semibold">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:opacity-100 opacity-70 transition-opacity cursor-pointer font-sans text-xs font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre
        className="p-4 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed"
        style={{ color: 'var(--text-primary)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

const HeadingBlock: React.FC<{ level: number; text: string }> = ({ level, text }) => {
  const cleanId = text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

  const baseStyles = 'font-bold tracking-tight scroll-mt-20';

  switch (level) {
    case 1:
      return (
        <h1
          id={cleanId}
          className={`${baseStyles} text-2xl md:text-3xl font-extrabold mt-8 mb-4 border-b pb-3`}
          style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
        >
          {parseInline(text)}
        </h1>
      );
    case 2:
      return (
        <h2
          id={cleanId}
          className={`${baseStyles} text-xl md:text-2xl font-bold mt-7 mb-3 border-b pb-2`}
          style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
        >
          {parseInline(text)}
        </h2>
      );
    case 3:
      return (
        <h3
          id={cleanId}
          className={`${baseStyles} text-lg md:text-xl font-bold mt-6 mb-2.5`}
          style={{ color: 'var(--text-accent)' }}
        >
          {parseInline(text)}
        </h3>
      );
    case 4:
      return (
        <h4
          id={cleanId}
          className={`${baseStyles} text-base md:text-lg font-semibold mt-5 mb-2`}
          style={{ color: 'var(--text-primary)' }}
        >
          {parseInline(text)}
        </h4>
      );
    default:
      return (
        <h5
          id={cleanId}
          className={`${baseStyles} text-sm md:text-base font-semibold mt-4 mb-2`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {parseInline(text)}
        </h5>
      );
  }
};

const AlertBlock: React.FC<{
  type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
  content: string;
}> = ({ type, content }) => {
  const configs = {
    NOTE: {
      bg: 'rgba(14, 165, 233, 0.08)',
      borderColor: 'rgba(14, 165, 233, 0.25)',
      textColor: '#0284C7',
      icon: <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
      label: 'Note',
    },
    TIP: {
      bg: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      textColor: '#059669',
      icon: <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
      label: 'Pro Tip',
    },
    IMPORTANT: {
      bg: 'rgba(168, 85, 247, 0.08)',
      borderColor: 'rgba(168, 85, 247, 0.25)',
      textColor: '#9333EA',
      icon: <AlertCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />,
      label: 'Important',
    },
    WARNING: {
      bg: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      textColor: '#D97706',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
      label: 'Exam Warning',
    },
    CAUTION: {
      bg: 'rgba(244, 63, 94, 0.08)',
      borderColor: 'rgba(244, 63, 94, 0.25)',
      textColor: '#E11D48',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
      label: 'Caution / Pitfall',
    },
  };

  const cfg = configs[type] || configs.NOTE;

  return (
    <div
      className="my-4 p-4 rounded-xl border flex gap-3 shadow-sm"
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.borderColor,
      }}
    >
      {cfg.icon}
      <div className="flex-1 text-sm space-y-1">
        <div
          className="font-bold uppercase tracking-wider text-xs"
          style={{ color: cfg.textColor }}
        >
          {cfg.label}
        </div>
        <div className="leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {parseInline(content)}
        </div>
      </div>
    </div>
  );
};

const TableBlock: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length < 2) return null;

  const parseRow = (line: string) => {
    return line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());
  };

  const headerCells = parseRow(lines[0]);
  const bodyRows = lines.slice(2).map(parseRow);

  return (
    <div
      className="my-5 overflow-x-auto rounded-xl border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <table className="w-full text-left text-sm border-collapse min-w-[500px]">
        <thead>
          <tr
            className="border-b"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {headerCells.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 font-bold text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                {parseInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {bodyRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className="hover:opacity-95 transition-opacity"
              style={{
                backgroundColor: rIdx % 2 === 0 ? 'transparent' : 'var(--bg-elevated)',
              }}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="px-4 py-3 align-top leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
