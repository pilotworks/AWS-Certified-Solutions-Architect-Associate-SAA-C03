import React, { useState } from 'react';
import { PracticeQuestion } from '../../types';
import { IconCircleCheck, IconCircleX, IconHelpCircle, IconBookmark, IconBookmarkFilled, IconKey } from '@tabler/icons-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MarkdownRenderer, parseInline } from '../markdown/markdown-renderer';
import confetti from 'canvas-confetti';

interface QuizCardProps {
  question: PracticeQuestion;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswerSubmit,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (key: string) => {
    if (isSubmitted) return;

    if (question.isMultiSelect) {
      if (selectedKeys.includes(key)) {
        setSelectedKeys(selectedKeys.filter((k) => k !== key));
      } else {
        if (selectedKeys.length < question.maxSelections) {
          setSelectedKeys([...selectedKeys, key]);
        }
      }
    } else {
      setSelectedKeys([key]);
    }
  };

  const handleSubmit = () => {
    if (selectedKeys.length === 0 || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect =
      selectedKeys.length === question.correctAnswerKeys.length &&
      selectedKeys.every((k) => question.correctAnswerKeys.includes(k));

    if (isCorrect) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.85 },
      });
    }

    onAnswerSubmit?.(isCorrect);
  };

  const handleReset = () => {
    setSelectedKeys([]);
    setIsSubmitted(false);
  };

  const isSelectionCorrect =
    isSubmitted &&
    selectedKeys.length === question.correctAnswerKeys.length &&
    selectedKeys.every((k) => question.correctAnswerKeys.includes(k));

  return (
    <div
      className="rounded-2xl p-5 md:p-6 border my-4 relative transition-colors shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header IconInfoCircle */}
      <div
        className="flex items-center justify-between gap-3 mb-4 pb-3 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="orange" size="md">
            Question #{question.questionNumber}
          </Badge>
          {question.isMultiSelect ? (
            <Badge variant="cyan">Select {question.maxSelections} Answers</Badge>
          ) : (
            <Badge variant="default">Single Choice</Badge>
          )}
          <Badge
            variant={
              question.difficulty === 'Hard'
                ? 'rose'
                : question.difficulty === 'Moderate'
                ? 'amber'
                : 'emerald'
            }
          >
            {question.difficulty}
          </Badge>
        </div>

        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            className="hover:opacity-100 opacity-60 transition-opacity p-1 cursor-pointer"
            style={{ color: 'var(--text-accent)' }}
            title={isBookmarked ? 'Remove IconBookmark' : 'IconBookmark Question'}
          >
            {isBookmarked ? (
              <IconBookmarkFilled className="w-5 h-5" style={{ color: 'var(--text-accent)' }} />
            ) : (
              <IconBookmark className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Scenario Text */}
      <div
        className="font-medium text-base md:text-lg leading-relaxed mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        <MarkdownRenderer content={question.scenario} />
      </div>

      {/* Exam Clues (Keywords) */}
      {question.examKeywords.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <IconKey className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Key Clues:
          </span>
          {question.examKeywords.map((kw, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--text-accent)',
                border: '1px solid var(--accent-border)',
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedKeys.includes(option.key);
          const isTargetCorrect = question.correctAnswerKeys.includes(option.key);

          let optionBg = 'var(--bg-elevated)';
          let optionBorder = 'var(--border-subtle)';
          let optionText = 'var(--text-primary)';

          if (isSubmitted) {
            if (isTargetCorrect) {
              optionBg = 'rgba(16, 185, 129, 0.12)';
              optionBorder = 'rgba(16, 185, 129, 0.4)';
              optionText = 'var(--text-primary)';
            } else if (isSelected && !isTargetCorrect) {
              optionBg = 'rgba(239, 68, 68, 0.12)';
              optionBorder = 'rgba(239, 68, 68, 0.4)';
              optionText = 'var(--text-primary)';
            } else {
              optionBg = 'var(--bg-elevated)';
              optionBorder = 'var(--border-subtle)';
              optionText = 'var(--text-muted)';
            }
          } else if (isSelected) {
            optionBg = 'var(--accent-bg)';
            optionBorder = 'var(--text-accent)';
            optionText = 'var(--text-primary)';
          }

          return (
            <div
              key={option.key}
              onClick={() => handleSelectOption(option.key)}
              className="p-3.5 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer select-none"
              style={{
                backgroundColor: optionBg,
                borderColor: optionBorder,
                color: optionText,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5"
                style={{
                  backgroundColor: isSelected
                    ? isSubmitted
                      ? isTargetCorrect
                        ? '#10B981'
                        : '#EF4444'
                      : 'var(--text-accent)'
                    : 'var(--bg-card)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {option.key}
              </div>

              <div className="flex-1 text-sm md:text-base leading-relaxed">
                {parseInline(option.text)}
              </div>

              {isSubmitted && isTargetCorrect && (
                <IconCircleCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              {isSubmitted && isSelected && !isTargetCorrect && (
                <IconCircleX className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedKeys.length === 0}
            size="md"
            className="w-full md:w-auto"
          >
            IconCheck Answer
          </Button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between flex-wrap">
            <div className="flex items-center gap-2">
              {isSelectionCorrect ? (
                <Badge variant="emerald" size="md">
                  <IconCircleCheck className="w-4 h-4" /> Correct Answer
                </Badge>
              ) : (
                <Badge variant="rose" size="md">
                  <IconCircleX className="w-4 h-4" /> Incorrect
                </Badge>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Explanation Box */}
      {isSubmitted && question.explanation && (
        <div
          className="mt-5 p-4 md:p-5 rounded-xl border text-sm"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="flex items-center gap-2 font-bold mb-2.5 text-sm" style={{ color: 'var(--text-accent)' }}>
            <IconHelpCircle className="w-4 h-4" /> Explanation:
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            <MarkdownRenderer content={question.explanation} />
          </div>
        </div>
      )}
    </div>
  );
};
