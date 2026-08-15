import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MODULES_METADATA } from '../data/modules-meta';
import { ModuleMeta } from '../types';
import { PageHead } from '../components/seo/page-head';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  BookOpen,
  Zap,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Workflow,
  FileText,
} from 'lucide-react';

interface DashboardPageProps {
  onSelectModule?: (moduleId: string) => void;
  completedModuleIds?: string[];
  masteredFlashcardsCount?: number;
  onSelectView?: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectModule,
  completedModuleIds = [],
  onSelectView,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeStudyMode = searchParams.get('mode') || 'fasttrack';

  const handleStudyModeChange = (mode: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('mode', mode);
    setSearchParams(next);
  };

  const handleModuleClick = (moduleId: string) => {
    if (onSelectModule) {
      onSelectModule(moduleId);
    } else {
      navigate(`/modules/${moduleId}`);
    }
  };

  const handleNavigate = (path: string) => {
    if (onSelectView) {
      onSelectView(path.replace('/', ''));
    }
    navigate(path);
  };

  const completedCount = completedModuleIds.length;
  const progressPercent = Math.round((completedCount / MODULES_METADATA.length) * 100);

  const courseSchemaJson = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'AWS Certified Solutions Architect - Associate (SAA-C03) Learning & Exam Hub',
    description:
      'Complete preparation course covering all 14 AWS SAA-C03 domains, architectural patterns, interactive 3D flashcards, and timed practice exam simulator.',
    provider: {
      '@type': 'Organization',
      name: 'AWS SAA-C03 Learning Hub',
    },
    educationalCredentialAwarded: 'AWS Certified Solutions Architect - Associate',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT14H',
    },
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <PageHead
        title="Dashboard & SAA-C03 Roadmaps"
        description="Comprehensive study roadmaps, 14 domain modules, flashcards, vector diagrams, and mock exam simulator for AWS SAA-C03."
        keywords={['AWS SAA-C03', 'AWS Solutions Architect', 'AWS Exam Prep', 'Cloud Architecture', 'AWS Cheat Sheets']}
        canonicalPath="/"
        schemaJson={courseSchemaJson}
      />

      {/* Hero Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 border shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--text-accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <Award className="w-3.5 h-3.5" /> AWS Certified Solutions Architect – Associate (SAA-C03)
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Architect Your Way to <span style={{ color: 'var(--text-accent)' }}>AWS Certification</span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A high-efficiency, zero-fluff study hub with 14 comprehensive service modules, interactive 3D flashcards, vector architecture diagrams, decision matrices, and full timed mock exams.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Button
              onClick={() => handleNavigate('/exam-simulator')}
              size="md"
              icon={<Award className="w-4 h-4" />}
            >
              Mock Exam Simulator
            </Button>
            <Button
              onClick={() => handleNavigate('/architecture')}
              variant="secondary"
              size="md"
              icon={<Workflow className="w-4 h-4 text-sky-500" />}
            >
              Architecture Patterns
            </Button>
            <Button
              onClick={() => handleNavigate('/flashcards')}
              variant="secondary"
              size="md"
              icon={<Layers className="w-4 h-4" />}
            >
              3D Flashcards
            </Button>
            <Button
              onClick={() => handleNavigate('/cheatsheets')}
              variant="secondary"
              size="md"
              icon={<FileText className="w-4 h-4" />}
            >
              Decision Matrices
            </Button>
          </div>
        </div>
      </div>

      {/* Study Mode Selector Cards */}
      <div>
        <div
          className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <Zap className="w-4 h-4" style={{ color: 'var(--text-accent)' }} /> Choose Your Learning Acceleration Mode
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode 1: Express Speed Run */}
          <div
            onClick={() => handleStudyModeChange('speedrun')}
            className="p-5 rounded-2xl border transition-all cursor-pointer"
            style={{
              backgroundColor: activeStudyMode === 'speedrun' ? 'var(--accent-bg)' : 'var(--bg-card)',
              borderColor: activeStudyMode === 'speedrun' ? 'var(--accent-border)' : 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-accent)' }}
              >
                ⚡
              </span>
              <Badge variant="orange">3 - 4 Hours</Badge>
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Express Speed-Run
            </h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              Ultra-condensed review targeting high-yield exam decision patterns and critical keywords.
            </p>
            <div className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>
              Ultra-Fast Cards Only <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mode 2: Complete Fast Track */}
          <div
            onClick={() => handleStudyModeChange('fasttrack')}
            className="p-5 rounded-2xl border transition-all cursor-pointer"
            style={{
              backgroundColor: activeStudyMode === 'fasttrack' ? 'var(--accent-bg)' : 'var(--bg-card)',
              borderColor: activeStudyMode === 'fasttrack' ? 'var(--accent-border)' : 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--bg-elevated)', color: '#0284C7' }}
              >
                🔥
              </span>
              <Badge variant="cyan">11 - 14 Hours</Badge>
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Complete Fast-Track
            </h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              Balanced curriculum combining fast notes, architecture diagrams, and targeted practice quizzes.
            </p>
            <div className="text-xs font-bold flex items-center gap-1" style={{ color: '#0284C7' }}>
              Recommended Path <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mode 3: 8-Week Structured Roadmap */}
          <div
            onClick={() => handleStudyModeChange('deepdive')}
            className="p-5 rounded-2xl border transition-all cursor-pointer"
            style={{
              backgroundColor: activeStudyMode === 'deepdive' ? 'var(--accent-bg)' : 'var(--bg-card)',
              borderColor: activeStudyMode === 'deepdive' ? 'var(--accent-border)' : 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--bg-elevated)', color: '#9333EA' }}
              >
                📅
              </span>
              <Badge variant="purple">8-Week Plan</Badge>
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Structured 8-Week Path
            </h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              Deep architectural immersion for beginners with exhaustive theory and scenario problem-solving.
            </p>
            <div className="text-xs font-bold flex items-center gap-1" style={{ color: '#9333EA' }}>
              Full Immersion <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Grid (14 Modules) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BookOpen className="w-5 h-5" style={{ color: 'var(--text-accent)' }} />
              14 SAA-C03 Curriculum Modules
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Click any module to open theory, fast notes, diagrams, and practice quizzes
            </p>
          </div>

          <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Completed: <strong style={{ color: 'var(--text-accent)' }}>{completedCount}</strong> / {MODULES_METADATA.length} ({progressPercent}%)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES_METADATA.map((m: ModuleMeta) => {
            const isCompleted = completedModuleIds.includes(m.id);

            return (
              <div
                key={m.id}
                onClick={() => handleModuleClick(m.id)}
                className="rounded-2xl p-5 border flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-accent)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {m.number < 10 ? `0${m.number}` : m.number}
                      </span>
                      <Badge variant="default">{m.domain}</Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <h3
                    className="font-bold text-base transition-colors mb-2 leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {m.title}
                  </h3>

                  <div
                    className="flex items-center gap-3 text-xs mb-4 flex-wrap"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="flex items-center gap-1 font-mono font-semibold" style={{ color: 'var(--text-accent)' }}>
                      Weight: {m.examWeight}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {m.timeEstimates.fastLearn}
                    </span>
                  </div>
                </div>

                <div
                  className="pt-3 border-t flex items-center justify-between text-xs font-medium"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>Explore Module</span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    style={{ color: 'var(--text-accent)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
