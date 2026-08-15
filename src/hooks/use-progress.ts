import { useState, useEffect } from 'react';
import { UserProgressState } from '../types';

const STORAGE_KEY = 'aws_learning_hub_progress_v1';

const DEFAULT_STATE: UserProgressState = {
  completedModules: [],
  completedUltraFast: [],
  completedFastLearn: [],
  masteredFlashcards: [],
  reviewFlashcards: [],
  quizScores: {},
  bookmarkedQuestions: [],
  userNotes: {},
  examHistory: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgressState>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? { ...DEFAULT_STATE, ...JSON.parse(item) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save study progress:', e);
    }
  }, [progress]);

  const toggleModuleComplete = (moduleId: string) => {
    setProgress((prev) => {
      const exists = prev.completedModules.includes(moduleId);
      return {
        ...prev,
        completedModules: exists
          ? prev.completedModules.filter((id) => id !== moduleId)
          : [...prev.completedModules, moduleId],
      };
    });
  };

  const markFlashcardMastered = (cardId: string) => {
    setProgress((prev) => ({
      ...prev,
      masteredFlashcards: Array.from(new Set([...prev.masteredFlashcards, cardId])),
      reviewFlashcards: prev.reviewFlashcards.filter((id) => id !== cardId),
    }));
  };

  const markFlashcardReview = (cardId: string) => {
    setProgress((prev) => ({
      ...prev,
      reviewFlashcards: Array.from(new Set([...prev.reviewFlashcards, cardId])),
      masteredFlashcards: prev.masteredFlashcards.filter((id) => id !== cardId),
    }));
  };

  const recordQuizScore = (quizId: string, score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: { score, total, date: Date.now() },
      },
    }));
  };

  const recordExamResult = (result: UserProgressState['examHistory'][0]) => {
    setProgress((prev) => ({
      ...prev,
      examHistory: [result, ...prev.examHistory],
    }));
  };

  const toggleBookmarkQuestion = (questionId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedQuestions.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestions: exists
          ? prev.bookmarkedQuestions.filter((id) => id !== questionId)
          : [...prev.bookmarkedQuestions, questionId],
      };
    });
  };

  const saveUserNote = (moduleId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      userNotes: {
        ...prev.userNotes,
        [moduleId]: note,
      },
    }));
  };

  return {
    progress,
    toggleModuleComplete,
    markFlashcardMastered,
    markFlashcardReview,
    recordQuizScore,
    recordExamResult,
    toggleBookmarkQuestion,
    saveUserNote,
  };
}

