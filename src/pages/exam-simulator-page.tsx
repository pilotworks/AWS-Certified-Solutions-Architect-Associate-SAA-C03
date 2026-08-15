import React, { useState, useEffect } from 'react';
import { getAllQuestions } from '../utils/content-loader';
import { PracticeQuestion } from '../types';
import { PageHead } from '../components/seo/page-head';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Award,
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamSimulatorPageProps {
  onSaveResult?: (result: any) => void;
}

export const ExamSimulatorPage: React.FC<ExamSimulatorPageProps> = ({ onSaveResult }) => {
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(130 * 60);

  const quizSchemaJson = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'AWS Solutions Architect Associate (SAA-C03) Exam Simulator',
    description: '65-question timed mock exam with real AWS scenarios testing HA, Security, Storage, Networking, and Cost Optimization.',
    educationalLevel: 'Associate / Intermediate',
    about: {
      '@type': 'Thing',
      name: 'AWS Certified Solutions Architect - Associate',
    },
  };

  const startNewExam = () => {
    const all = getAllQuestions();
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(65, shuffled.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIds([]);
    setTimeLeft(130 * 60);
    setExamSubmitted(false);
    setExamStarted(true);
  };

  useEffect(() => {
    let timer: any = null;
    if (examStarted && !examSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeLeft]);

  const handleSelectOption = (key: string) => {
    if (examSubmitted) return;
    const currentQ = questions[currentIndex];
    const prev = userAnswers[currentQ.id] || [];

    if (currentQ.isMultiSelect) {
      if (prev.includes(key)) {
        setUserAnswers({ ...userAnswers, [currentQ.id]: prev.filter((k) => k !== key) });
      } else {
        if (prev.length < currentQ.maxSelections) {
          setUserAnswers({ ...userAnswers, [currentQ.id]: [...prev, key] });
        }
      }
    } else {
      setUserAnswers({ ...userAnswers, [currentQ.id]: [key] });
    }
  };

  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (flaggedIds.includes(currentQ.id)) {
      setFlaggedIds(flaggedIds.filter((id) => id !== currentQ.id));
    } else {
      setFlaggedIds([...flaggedIds, currentQ.id]);
    }
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);

    let correctCount = 0;
    const domainBreakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const selected = userAnswers[q.id] || [];
      const isCorrect =
        selected.length === q.correctAnswerKeys.length &&
        selected.every((k) => q.correctAnswerKeys.includes(k));

      if (isCorrect) correctCount++;

      const domain = q.moduleId || 'General';
      if (!domainBreakdown[domain]) {
        domainBreakdown[domain] = { correct: 0, total: 0 };
      }
      domainBreakdown[domain].total++;
      if (isCorrect) domainBreakdown[domain].correct++;
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    if (scorePercentage >= 72) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    onSaveResult?.({
      id: `exam-${Date.now()}`,
      date: Date.now(),
      score: correctCount,
      totalQuestions: questions.length,
      timeSpentSeconds: 130 * 60 - timeLeft,
      domainBreakdown,
    });
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].length > 0
  ).length;

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <PageHead
          title="Exam Simulator (130 min / 65 Questions)"
          description="Timed AWS Solutions Architect Associate mock exam under real test conditions."
          keywords={['AWS Exam Simulator', 'SAA-C03 Mock Exam', 'Practice Test']}
          canonicalPath="/exam-simulator"
          schemaJson={quizSchemaJson}
        />
        <div
          className="rounded-2xl p-8 md:p-12 text-center border shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--text-accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <Award className="w-8 h-8" />
          </div>

          <h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            AWS SAA-C03 Official Exam Simulator
          </h1>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Experience real exam conditions with timed question delivery, multi-select scenarios, and domain-by-domain analytics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Questions</div>
              <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>65 Questions</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Scenario-based</div>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Time Limit</div>
              <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-accent)' }}>130 Minutes</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>2 min per question</div>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Passing Score</div>
              <div className="text-xl font-bold text-emerald-500 mt-1">720 / 1000 (72%)</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Scalable scoring</div>
            </div>
          </div>

          <Button onClick={startNewExam} size="lg" className="px-8">
            Launch Mock Exam Now
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentSelected = userAnswers[currentQ?.id] || [];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Top Header & Live Timer */}
      <div
        className="rounded-xl p-4 flex items-center justify-between gap-4 border sticky top-20 z-30 backdrop-blur-md transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3">
          <Badge variant="orange" size="md">
            Exam Mode
          </Badge>
          <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
            Answered: <strong style={{ color: 'var(--text-primary)' }}>{answeredCount}</strong> / {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm"
            style={{
              backgroundColor: timeLeft < 15 * 60 ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-elevated)',
              borderColor: timeLeft < 15 * 60 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)',
              color: timeLeft < 15 * 60 ? '#EF4444' : 'var(--text-accent)',
            }}
          >
            <Clock className="w-4 h-4" />
            {formatTimer(timeLeft)}
          </div>

          {!examSubmitted && (
            <Button variant="danger" size="sm" onClick={handleSubmitExam}>
              Submit Exam
            </Button>
          )}
        </div>
      </div>

      {/* Results View when Submitted */}
      {examSubmitted && (
        <div
          className="rounded-2xl p-6 md:p-8 border space-y-6 shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div className="text-center">
            <h2
              className="text-2xl md:text-3xl font-extrabold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Exam Results & Analytics
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Completed in {formatTimer(130 * 60 - timeLeft)}
            </p>
          </div>

          <div className="flex justify-center gap-6 text-center">
            <div
              className="p-4 rounded-xl border min-w-[140px]"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Total Score</div>
              <div className="text-3xl font-extrabold mt-1" style={{ color: 'var(--text-accent)' }}>
                {Math.round(
                  (questions.filter((q) => {
                    const sel = userAnswers[q.id] || [];
                    return (
                      sel.length === q.correctAnswerKeys.length &&
                      sel.every((k) => q.correctAnswerKeys.includes(k))
                    );
                  }).length /
                    questions.length) *
                    100
                )}
                %
              </div>
            </div>

            <div
              className="p-4 rounded-xl border min-w-[140px]"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Status</div>
              <div
                className={`text-2xl font-bold mt-1.5 ${
                  Math.round(
                    (questions.filter((q) => {
                      const sel = userAnswers[q.id] || [];
                      return (
                        sel.length === q.correctAnswerKeys.length &&
                        sel.every((k) => q.correctAnswerKeys.includes(k))
                      );
                    }).length /
                      questions.length) *
                      100
                  ) >= 72
                    ? 'text-emerald-500'
                    : 'text-rose-500'
                }`}
              >
                {Math.round(
                  (questions.filter((q) => {
                    const sel = userAnswers[q.id] || [];
                    return (
                      sel.length === q.correctAnswerKeys.length &&
                      sel.every((k) => q.correctAnswerKeys.includes(k))
                    );
                  }).length /
                    questions.length) *
                    100
                ) >= 72
                  ? 'PASS'
                  : 'FAIL'}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={startNewExam} size="md" icon={<RotateCcw className="w-4 h-4" />}>
              Retake Another Exam
            </Button>
          </div>
        </div>
      )}

      {/* Main Question Arena */}
      {currentQ && (
        <div
          className="rounded-2xl p-6 md:p-8 border shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex items-center justify-between gap-3 mb-4 pb-3 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-accent)' }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQ.isMultiSelect ? (
                <Badge variant="cyan">Choose {currentQ.maxSelections}</Badge>
              ) : (
                <Badge variant="default">Single Choice</Badge>
              )}
            </div>

            <button
              onClick={handleToggleFlag}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: flaggedIds.includes(currentQ.id) ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-elevated)',
                borderColor: flaggedIds.includes(currentQ.id) ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)',
                color: flaggedIds.includes(currentQ.id) ? '#EF4444' : 'var(--text-secondary)',
              }}
            >
              <Flag className="w-3.5 h-3.5" /> Flag for Review
            </button>
          </div>

          <div
            className="font-medium text-base md:text-lg leading-relaxed mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentQ.scenario}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt) => {
              const isSelected = currentSelected.includes(opt.key);
              const isTargetCorrect = currentQ.correctAnswerKeys.includes(opt.key);

              let optBg = 'var(--bg-elevated)';
              let optBorder = 'var(--border-subtle)';
              let optColor = 'var(--text-primary)';

              if (examSubmitted) {
                if (isTargetCorrect) {
                  optBg = 'rgba(16, 185, 129, 0.12)';
                  optBorder = 'rgba(16, 185, 129, 0.4)';
                  optColor = 'var(--text-primary)';
                } else if (isSelected && !isTargetCorrect) {
                  optBg = 'rgba(239, 68, 68, 0.12)';
                  optBorder = 'rgba(239, 68, 68, 0.4)';
                  optColor = 'var(--text-primary)';
                } else {
                  optBg = 'var(--bg-elevated)';
                  optBorder = 'var(--border-subtle)';
                  optColor = 'var(--text-muted)';
                }
              } else if (isSelected) {
                optBg = 'var(--accent-bg)';
                optBorder = 'var(--text-accent)';
                optColor = 'var(--text-primary)';
              }

              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className="p-4 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer select-none"
                  style={{
                    backgroundColor: optBg,
                    borderColor: optBorder,
                    color: optColor,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected
                        ? examSubmitted
                          ? isTargetCorrect
                            ? '#10B981'
                            : '#EF4444'
                          : 'var(--text-accent)'
                        : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {opt.key}
                  </div>
                  <div className="flex-1 text-sm md:text-base leading-relaxed">{opt.text}</div>
                </div>
              );
            })}
          </div>

          {/* Explanation if Submitted */}
          {examSubmitted && currentQ.explanation && (
            <div
              className="p-4 rounded-xl border text-sm mb-6"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="font-bold mb-1" style={{ color: 'var(--text-accent)' }}>Explanation:</div>
              <div className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
                {currentQ.explanation}
              </div>
            </div>
          )}

          {/* Bottom Navigation Controls */}
          <div
            className="flex items-center justify-between gap-4 pt-4 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <Button
              variant="secondary"
              size="md"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((c) => c - 1)}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((c) => c + 1)}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Question Grid Navigator */}
      <div
        className="rounded-xl p-5 border shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Question Navigator
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-13 gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] && userAnswers[q.id].length > 0;
            const isFlagged = flaggedIds.includes(q.id);
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className="w-full aspect-square rounded-lg font-mono text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative border"
                style={{
                  backgroundColor: isCurrent
                    ? 'var(--text-accent)'
                    : isAnswered
                    ? 'var(--bg-elevated)'
                    : 'var(--bg-card)',
                  borderColor: isCurrent ? 'var(--text-accent)' : 'var(--border-subtle)',
                  color: isCurrent ? '#FFFFFF' : isAnswered ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
