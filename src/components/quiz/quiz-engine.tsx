import React, { useState } from "react";
import { PracticeQuestion } from "../../types";
import { QuizCard } from "./quiz-card";
import { Button } from "../ui/button";
import {
  IconAward,
  IconRotate,
  IconFilter,
  IconCircleCheck,
  IconDeviceFloppy,
} from "@tabler/icons-react";

interface QuizEngineProps {
  questions: PracticeQuestion[];
  title?: string;
  onFinish?: (score: number, total: number) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  title,
  onFinish,
  bookmarkedIds = [],
  onToggleBookmark,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [resetKey, setResetKey] = useState<number>(0);

  const filteredQuestions = questions.filter((q) => {
    if (filterDifficulty === "all") return true;
    return q.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  const handleAnswer = (isCorrect: boolean) => {
    setAnsweredCount((c) => c + 1);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleResetAll = () => {
    setAnsweredCount(0);
    setCorrectCount(0);
    setResetKey((k) => k + 1);
  };

  const scorePercentage =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div key={resetKey} className="space-y-6">
      {/* Quiz Top Toolbar & Live Score */}
      <div
        className="rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border shadow-sm transition-colors"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div>
          <h2
            className="text-lg md:text-xl font-bold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <IconAward
              className="w-5 h-5"
              style={{ color: "var(--text-accent)" }}
            />
            {title || "Practice Assessment Arena"}
          </h2>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Total {filteredQuestions.length} exam-style scenario questions
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Score:
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-accent)" }}
            >
              {correctCount} / {answeredCount}
            </span>
            {answeredCount > 0 && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  scorePercentage >= 72
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30"
                }`}
              >
                {scorePercentage}%{" "}
                {scorePercentage >= 72 ? "(Pass)" : "(Fail < 72%)"}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            title="Reset Quiz"
            className="border hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <IconRotate className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Difficulty IconFilter */}
      <div
        className="flex items-center gap-2 flex-wrap text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="flex items-center gap-1 font-semibold">
          <IconFilter
            className="w-3.5 h-3.5"
            style={{ color: "var(--text-accent)" }}
          />{" "}
          IconFilter:
        </span>
        {["all", "foundation", "moderate", "hard"].map((diff) => {
          const isSelected = filterDifficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className="px-3 py-1.5 rounded-xl capitalize font-medium transition-all cursor-pointer border"
              style={{
                backgroundColor: isSelected
                  ? "var(--accent-bg)"
                  : "var(--bg-card)",
                borderColor: isSelected
                  ? "var(--accent-border)"
                  : "var(--border-subtle)",
                color: isSelected
                  ? "var(--text-accent)"
                  : "var(--text-secondary)",
              }}
            >
              {diff}
            </button>
          );
        })}
      </div>

      {/* Questions Stack */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 glass-card rounded-xl">
            No questions found for this filter.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <QuizCard
              key={q.id}
              question={q}
              onAnswerSubmit={handleAnswer}
              isBookmarked={bookmarkedIds.includes(q.id)}
              onToggleBookmark={() => onToggleBookmark?.(q.id)}
            />
          ))
        )}
      </div>

      {/* Finish Banner */}
      {answeredCount > 0 && answeredCount === filteredQuestions.length && (
        <div className="glass-card rounded-2xl p-6 text-center border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-slate-950">
          <IconCircleCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">
            Module Practice Completed!
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            You scored{" "}
            <strong className="text-amber-400">{correctCount}</strong> out of{" "}
            <strong>{filteredQuestions.length}</strong> ({scorePercentage}%).
          </p>
          <Button
            onClick={() => onFinish?.(correctCount, filteredQuestions.length)}
            size="md"
            className="mx-auto"
          >
            <IconDeviceFloppy /> Progress
          </Button>
        </div>
      )}
    </div>
  );
};
