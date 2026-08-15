import React from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MODULES_METADATA } from '../data/modules-meta';
import { ModuleMeta } from '../types';
import { getDocContent, parsePracticeQuestions } from '../utils/content-loader';
import { MarkdownRenderer } from '../components/markdown/markdown-renderer';
import { QuizEngine } from '../components/quiz/quiz-engine';
import { ModuleNotes } from '../components/ui/module-notes';
import { PageHead } from '../components/seo/page-head';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  IconBook,
  IconBolt,
  IconSitemap,
  IconAward,
  IconCircleCheck,
  IconClock,
  IconArrowLeft,
  IconFileText,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';

interface ModuleDetailPageProps {
  module?: ModuleMeta;
  onBackToDashboard?: () => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  userNotes?: Record<string, string>;
  onSaveNote?: (moduleId: string, note: string) => void;
}

export const ModuleDetailPage: React.FC<ModuleDetailPageProps> = ({
  module: propModule,
  onBackToDashboard,
  isCompleted = false,
  onToggleComplete,
  bookmarkedIds = [],
  onToggleBookmark,
  userNotes = {},
  onSaveNote,
}) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Find module from props or URL param
  const currentModule =
    propModule ||
    MODULES_METADATA.find((m) => m.id === id || m.slug === id) ||
    MODULES_METADATA[0];

  const activeTab = (searchParams.get('tab') as 'overview' | 'fast' | 'diagrams' | 'quiz' | 'notes') || 'overview';
  const fastTrackMode = (searchParams.get('mode') as 'fast' | 'ultra') || 'fast';

  const handleTabChange = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next);
  };

  const handleFastTrackModeChange = (mode: 'fast' | 'ultra') => {
    const next = new URLSearchParams(searchParams);
    next.set('mode', mode);
    setSearchParams(next);
  };

  const readmeContent = getDocContent(`${currentModule.id}/README.md`);
  const fastLearnContent = getDocContent(`${currentModule.id}/FAST-LEARN.md`);
  const ultraFastContent = getDocContent(`${currentModule.id}/ULTRA-FAST-LEARN.md`);
  const diagramsContent = getDocContent(`${currentModule.id}/DIAGRAMS.md`);
  const practiceContent = getDocContent(`${currentModule.id}/PRACTICE-QUESTIONS.md`);

  const practiceQuestions = parsePracticeQuestions(practiceContent, currentModule.id);

  const currentIndex = MODULES_METADATA.findIndex((m) => m.id === currentModule.id);
  const prevModule = currentIndex > 0 ? MODULES_METADATA[currentIndex - 1] : null;
  const nextModule =
    currentIndex >= 0 && currentIndex < MODULES_METADATA.length - 1
      ? MODULES_METADATA[currentIndex + 1]
      : null;

  const handleBack = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate('/');
    }
  };

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `Module ${currentModule.number < 10 ? '0' : ''}${currentModule.number}: ${currentModule.title}`,
    description: `Complete AWS SAA-C03 guide for ${currentModule.title} covering architecture theory, fast-track summaries, vector diagrams, and practice questions.`,
    articleSection: currentModule.domain,
    keywords: `AWS, ${currentModule.title}, ${currentModule.domain}, SAA-C03, Solutions Architect`,
  };

  const tabOptions = [
    { key: 'overview', label: 'Comprehensive Theory', icon: IconBook },
    { key: 'fast', label: 'Fast-Track Notes', icon: IconBolt },
    { key: 'diagrams', label: 'Diagrams', icon: IconSitemap },
    { key: 'quiz', label: `Practice (${practiceQuestions.length})`, icon: IconAward },
    { key: 'notes', label: 'Personal Notes', icon: IconFileText },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <PageHead
        title={`Module ${currentModule.number < 10 ? '0' : ''}${currentModule.number}: ${currentModule.title}`}
        description={`In-depth preparation guide for ${currentModule.title} - AWS Certified Solutions Architect Associate (SAA-C03).`}
        keywords={['AWS', currentModule.title, currentModule.domain, 'SAA-C03']}
        canonicalPath={`/modules/${currentModule.id}`}
        schemaJson={schemaJson}
      />

      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-100 opacity-70 transition-opacity cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
        >
          <IconArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          {onToggleComplete && (
            <Button
              variant={isCompleted ? 'secondary' : 'outline'}
              size="sm"
              onClick={onToggleComplete}
              className={isCompleted ? 'text-emerald-500 font-semibold' : ''}
            >
              <IconCircleCheck className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : 'opacity-40'}`} />
              {isCompleted ? 'Completed' : 'Mark as Completed'}
            </Button>
          )}
        </div>
      </div>

      {/* Module Title Banner */}
      <div
        className="rounded-2xl p-6 md:p-8 border shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2.5 flex-wrap mb-3">
          <Badge variant="orange" size="md">
            Module #{currentModule.number < 10 ? `0${currentModule.number}` : currentModule.number}
          </Badge>
          <Badge variant="cyan">{currentModule.domain}</Badge>
          <Badge variant="emerald">Exam Weight: {currentModule.examWeight}</Badge>
          <Badge variant={currentModule.priority === 'CRITICAL' ? 'rose' : 'amber'}>
            {currentModule.priority} Priority
          </Badge>
        </div>

        <h1
          className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {currentModule.title}
        </h1>

        <div
          className="flex items-center gap-4 text-xs font-medium flex-wrap"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="flex items-center gap-1">
            <IconClock className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Deep Dive: {currentModule.timeEstimates.deepDive}
          </span>
          <span>•</span>
          <span>Fast Learn: {currentModule.timeEstimates.fastLearn}</span>
          <span>•</span>
          <span>Ultra-Fast: {currentModule.timeEstimates.ultraFast}</span>
          <span>•</span>
          <span>{practiceQuestions.length} Practice Questions</span>
        </div>
      </div>

      {/* Tab Navigation Switcher */}
      <div
        className="flex items-center gap-2 border-b pb-2 overflow-x-auto scrollbar-none"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {tabOptions.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
                color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Comprehensive Theory (README.md) */}
      {activeTab === 'overview' && (
        <div
          className="rounded-2xl p-6 md:p-8 border shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <MarkdownRenderer content={readmeContent || '# Content loading...'} />
        </div>
      )}

      {/* Tab 2: Fast-Track Notes */}
      {activeTab === 'fast' && (
        <div className="space-y-4">
          <div
            className="flex items-center gap-2 p-1.5 rounded-xl border w-fit"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              onClick={() => handleFastTrackModeChange('fast')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: fastTrackMode === 'fast' ? 'var(--accent-bg)' : 'transparent',
                color: fastTrackMode === 'fast' ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: fastTrackMode === 'fast' ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              Standard Fast-Learn (~{currentModule.timeEstimates.fastLearn})
            </button>
            <button
              onClick={() => handleFastTrackModeChange('ultra')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: fastTrackMode === 'ultra' ? 'var(--accent-bg)' : 'transparent',
                color: fastTrackMode === 'ultra' ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: fastTrackMode === 'ultra' ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              ⚡ Ultra-Fast Review (~{currentModule.timeEstimates.ultraFast})
            </button>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8 border shadow-sm transition-colors"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <MarkdownRenderer
              content={
                fastTrackMode === 'fast'
                  ? fastLearnContent || '# Fast Learn content coming soon'
                  : ultraFastContent || '# Ultra Fast content coming soon'
              }
            />
          </div>
        </div>
      )}

      {/* Tab 3: Architecture Diagrams */}
      {activeTab === 'diagrams' && (
        <div
          className="rounded-2xl p-6 md:p-8 border shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <MarkdownRenderer content={diagramsContent || '# No diagrams found for this module.'} />
        </div>
      )}

      {/* Tab 4: Practice Questions */}
      {activeTab === 'quiz' && (
        <div>
          <QuizEngine
            questions={practiceQuestions}
            title={`${currentModule.title} - Question Bank`}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={onToggleBookmark}
          />
        </div>
      )}

      {/* Tab 5: Personal Notes */}
      {activeTab === 'notes' && onSaveNote && (
        <div>
          <ModuleNotes
            moduleId={currentModule.id}
            moduleTitle={currentModule.title}
            savedNote={userNotes[currentModule.id] || ''}
            onSaveNote={onSaveNote}
          />
        </div>
      )}

      {/* Bottom Previous / Next Module Navigation */}
      <div
        className="flex items-center justify-between gap-4 pt-8 border-t mt-12"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {prevModule ? (
          <Link
            to={`/modules/${prevModule.id}?tab=overview`}
            className="flex items-center gap-3 p-4 rounded-xl border hover:opacity-90 transition-all text-left group max-w-[48%]"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <IconChevronLeft
              className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform"
              style={{ color: 'var(--text-accent)' }}
            />
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Previous Module
              </div>
              <div className="text-sm font-bold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                {prevModule.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            to={`/modules/${nextModule.id}?tab=overview`}
            className="flex items-center justify-end gap-3 p-4 rounded-xl border hover:opacity-90 transition-all text-right group max-w-[48%] ml-auto"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Next Module
              </div>
              <div className="text-sm font-bold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                {nextModule.title}
              </div>
            </div>
            <IconChevronRight
              className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform"
              style={{ color: 'var(--text-accent)' }}
            />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
