import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDocContent } from '../utils/content-loader';
import { MarkdownRenderer } from '../components/markdown/markdown-renderer';
import { DecisionMatrixTable } from '../components/ui/decision-matrix-table';
import { DECISION_MATRICES } from '../data/decision-matrices';
import { PageHead } from '../components/seo/page-head';
import { FileText, Zap, Table2, BookOpen, Clock, Lightbulb } from 'lucide-react';

export const CheatSheetsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'matrices';
  const activeMatrix = searchParams.get('matrix') || 's3-storage-classes';
  const searchQuery = searchParams.get('q') || '';

  const handleTabChange = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next);
  };

  const handleMatrixChange = (matrixId: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'matrices');
    next.set('matrix', matrixId);
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

  const sheets: Record<string, { title: string; file: string; desc: string; icon: any }> = {
    matrices: {
      title: 'Interactive Decision Matrices',
      file: '',
      desc: 'Dynamic comparison tables for S3 Classes, ELBs, Databases & Storage',
      icon: Table2,
    },
    patterns: {
      title: 'Architecture Patterns Master',
      file: 'reference/SAA-ARCHITECTURE-PATTERN-MASTER-SHEET.md',
      desc: 'HA, Disaster Recovery (RTO/RPO), Multi-tier & Event-Driven Patterns',
      icon: BookOpen,
    },
    quickRef: {
      title: 'Quick Reference Guide',
      file: 'reference/QUICK-REFERENCE.md',
      desc: 'High-yield service limits, comparison matrices & key facts',
      icon: FileText,
    },
    examDay: {
      title: 'Exam Day 30-Min Cram Sheet',
      file: 'exam-reviews/quick-reference/ULTRA-SHORT-EXAM-DAY.md',
      desc: 'Last-minute memory cards and instant keyword associations',
      icon: Clock,
    },
    memoryCards: {
      title: 'Decision Memory Cards',
      file: 'exam-reviews/quick-reference/MEMORY-CARDS.md',
      desc: 'Scenario-to-solution decision rules for rapid question solving',
      icon: Lightbulb,
    },
  };

  const currentContent = activeTab !== 'matrices' ? getDocContent(sheets[activeTab]?.file || '') : '';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <PageHead
        title="Decision Matrices & Cheat Sheets"
        description="Quick reference tables, interactive decision matrices (S3, ELB, Databases, Storage) and cram sheets for AWS SAA-C03."
        keywords={['AWS Cheat Sheet', 'Decision Matrix', 'S3 Storage Classes', 'ALB vs NLB', 'SAA-C03']}
        canonicalPath="/cheatsheets"
      />

      {/* Top Banner */}
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
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--text-accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>High-Yield Knowledge Base</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Decision Matrices & Cheat Sheet Library
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Multi-dimensional comparison matrices, high-yield service trade-offs, and rapid exam-day cheat sheets formatted for fast memorization.
          </p>
        </div>
      </div>

      {/* Tab Switcher Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.keys(sheets).map((key) => {
          const item = sheets[key];
          const isSelected = activeTab === key;
          const Icon = item.icon;

          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className="p-4 rounded-xl border text-left transition-all cursor-pointer"
              style={{
                backgroundColor: isSelected ? 'var(--accent-bg)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--accent-border)' : 'var(--border-subtle)',
                color: isSelected ? 'var(--text-accent)' : 'var(--text-primary)',
              }}
            >
              <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                <Icon
                  className="w-4 h-4"
                  style={{ color: isSelected ? 'var(--text-accent)' : 'var(--text-muted)' }}
                />
                <span className="truncate">{item.title}</span>
              </div>
              <div
                className="text-[11px] line-clamp-2 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Rendering */}
      {activeTab === 'matrices' ? (
        <div
          className="rounded-2xl p-6 sm:p-8 border space-y-6 shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <DecisionMatrixTable
            categories={DECISION_MATRICES}
            activeCategoryId={activeMatrix}
            onSelectCategory={handleMatrixChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 sm:p-8 border shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <MarkdownRenderer content={currentContent || '# Content loading...'} />
        </div>
      )}
    </div>
  );
};
