import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ARCHITECTURE_PATTERNS } from '../data/architecture-patterns';
import { PatternType } from '../types';
import { MermaidViewer } from '../components/architecture/mermaid-viewer';
import { PageHead } from '../components/seo/page-head';
import {
  Workflow,
  Search,
  CheckCircle2,
  Layers,
  ShieldAlert,
  Server,
  Network,
  Zap,
  ArrowRight,
} from 'lucide-react';

const PATTERN_FILTERS: { type: PatternType | 'all'; label: string; icon: any }[] = [
  { type: 'all', label: 'All Patterns', icon: Layers },
  { type: 'HA_DR', label: 'High Availability & DR', icon: ShieldAlert },
  { type: 'Serverless', label: 'Serverless Event-Driven', icon: Zap },
  { type: 'Decoupled', label: 'Decoupled Fanout (SQS/SNS)', icon: Workflow },
  { type: 'MultiTier', label: 'Multi-Tier Web & VPC', icon: Server },
  { type: 'HybridNetwork', label: 'Hybrid & Transit Gateway', icon: Network },
];

export const ArchitecturePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activePattern = (searchParams.get('pattern') as PatternType | 'all') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const handlePatternChange = (type: PatternType | 'all') => {
    const next = new URLSearchParams(searchParams);
    if (type === 'all') {
      next.delete('pattern');
    } else {
      next.set('pattern', type);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (q: string) => {
    const next = new URLSearchParams(searchParams);
    if (!q) {
      next.delete('q');
    } else {
      next.set('q', q);
    }
    setSearchParams(next);
  };

  const filteredPatterns = useMemo(() => {
    return ARCHITECTURE_PATTERNS.filter((pat) => {
      const matchType = activePattern === 'all' || pat.patternType === activePattern;
      if (!matchType) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = pat.title.toLowerCase().includes(q);
      const matchScenario = pat.scenario.toLowerCase().includes(q);
      const matchServices = pat.recommendedServices.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchScenario || matchServices;
    });
  }, [activePattern, searchQuery]);

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AWS SAA-C03 Architectural Patterns & Mermaid Diagrams',
    description:
      'High-availability, disaster recovery, serverless, and decoupled reference architectures with interactive Mermaid vector diagrams.',
    articleSection: 'AWS Architecture',
    keywords: 'AWS Architecture, HA/DR, Serverless, Decoupled, SAA-C03, Mermaid diagrams',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHead
        title="Architecture Patterns & Visual Diagrams"
        description="Explore production-grade AWS architecture patterns (Multi-AZ HA, Warm Standby DR, Serverless, Decoupled Fanout) with interactive Mermaid diagrams."
        keywords={['AWS Architecture', 'Mermaid Diagrams', 'HA/DR', 'SAA-C03', 'Serverless', 'Transit Gateway']}
        canonicalPath="/architecture"
        schemaJson={schemaJson}
      />

      {/* Header Banner */}
      <div
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              borderColor: 'rgba(2, 132, 199, 0.25)',
              borderWidth: '1px',
              color: '#0284C7',
            }}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Interactive Vector Architecture Engine</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            AWS Architecture Patterns & Diagram Gallery
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Master core Solutions Architect Associate design patterns: High Availability, Multi-Region DR, Serverless Event-Driven, and Hybrid Cloud. Pan, zoom, inspect, and export clean PNG/SVG vector diagrams.
          </p>
        </div>
      </div>

      {/* Filter Toolbar with Query String Sync */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Pattern Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {PATTERN_FILTERS.map((f) => {
            const isActive = activePattern === f.type;
            const Icon = f.icon;
            return (
              <button
                key={f.type}
                onClick={() => handlePatternChange(f.type)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--accent-bg)' : 'var(--bg-elevated)',
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                }}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? 'var(--text-accent)' : 'var(--text-muted)' }}
                />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search architecture patterns..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-base md:text-xs transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              borderWidth: '1px',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Pattern Cards List */}
      <div className="space-y-8">
        {filteredPatterns.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No architecture patterns found matching your search.
            </p>
          </div>
        ) : (
          filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="rounded-2xl border p-6 sm:p-8 space-y-6 shadow-sm transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {/* Pattern Header */}
              <div
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium"
                      style={{
                        backgroundColor: 'rgba(2, 132, 199, 0.08)',
                        borderColor: 'rgba(2, 132, 199, 0.25)',
                        borderWidth: '1px',
                        color: '#0284C7',
                      }}
                    >
                      {pattern.patternType}
                    </span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-mono"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      Domain: {pattern.domain}
                    </span>
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {pattern.title}
                  </h2>
                  <p className="text-xs leading-relaxed max-w-4xl" style={{ color: 'var(--text-secondary)' }}>
                    {pattern.scenario}
                  </p>
                </div>

                {/* Tradeoffs Metrics */}
                <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                  <div
                    className="px-3 py-2 rounded-xl border text-center"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
                      Cost
                    </div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>
                      {pattern.tradeoffs.cost}
                    </div>
                  </div>
                  <div
                    className="px-3 py-2 rounded-xl border text-center"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
                      Complexity
                    </div>
                    <div className="text-xs font-bold text-sky-500">
                      {pattern.tradeoffs.complexity}
                    </div>
                  </div>
                  <div
                    className="px-3 py-2 rounded-xl border text-center"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
                      Scale
                    </div>
                    <div className="text-xs font-bold text-emerald-500">
                      {pattern.tradeoffs.scalability}
                    </div>
                  </div>
                </div>
              </div>

              {/* RTO / RPO Metrics & Recommended Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {(pattern.rtoRequirement || pattern.rpoRequirement) && (
                  <div
                    className="p-3.5 rounded-xl border space-y-1"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <span className="font-mono text-[11px] block" style={{ color: 'var(--text-muted)' }}>
                      Availability Target:
                    </span>
                    <div className="flex items-center gap-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {pattern.rtoRequirement && (
                        <span>
                          RTO: <strong className="font-mono" style={{ color: 'var(--text-accent)' }}>{pattern.rtoRequirement}</strong>
                        </span>
                      )}
                      {pattern.rpoRequirement && (
                        <span>
                          RPO: <strong className="text-emerald-500 font-mono">{pattern.rpoRequirement}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <span className="font-mono text-[11px] block" style={{ color: 'var(--text-muted)' }}>
                    Recommended AWS Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {pattern.recommendedServices.map((svc) => (
                      <span
                        key={svc}
                        className="text-[11px] px-2 py-0.5 rounded font-medium border"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Mermaid Diagram Viewer */}
              <div>
                <MermaidViewer chart={pattern.diagramMermaid} title={pattern.title} />
              </div>

              {/* Key Takeaways */}
              <div
                className="rounded-xl p-4 border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <h4
                  className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exam Takeaways & Architecture Best Practices</span>
                </h4>
                <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {pattern.keyTakeaways.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--text-accent)' }} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
