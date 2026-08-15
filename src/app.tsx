import React, { useEffect, useState } from 'react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IconExternalLink } from '@tabler/icons-react';
import { MODULES_METADATA } from './data/modules-meta';
import { ThemeProvider } from './context/theme-context';
import { Header } from './components/layout/header';
import { Sidebar } from './components/layout/sidebar';
import { CommandPalette } from './components/search/command-palette';
import { DashboardPage } from './pages/dashboard-page';
import { ModuleDetailPage } from './pages/module-detail-page';
import { ArchitecturePage } from './pages/architecture-page';
import { ExamSimulatorPage } from './pages/exam-simulator-page';
import { FlashcardsPage } from './pages/flashcards-page';
import { CheatSheetsPage } from './pages/cheat-sheets-page';
import { useProgress } from './hooks/use-progress';
import { OfflineStatus } from './components/pwa/offline-status';
import { AUTHOR_NAME, AUTHOR_URL } from './components/seo/seo-config';
import { NotFoundPage } from './pages/not-found-page';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

export function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  const {
    progress,
    toggleModuleComplete,
    markFlashcardMastered,
    markFlashcardReview,
    recordExamResult,
    toggleBookmarkQuestion,
    saveUserNote,
  } = useProgress();

  const overallProgressPercent = Math.round(
    (progress.completedModules.length / MODULES_METADATA.length) * 100
  );

  return (
    <div
      className="min-h-screen flex flex-col antialiased transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      <OfflineStatus />
      <ScrollToTop />
      {/* Global Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        overallProgressPercent={overallProgressPercent}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex pt-16">
        {/* Left Sidebar */}
        <Sidebar
          completedModuleIds={progress.completedModules}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0">
          <div className="flex-1 pb-16">
            <Routes>
              {/* Dashboard & Roadmap */}
              <Route
                path="/"
                element={
                  <DashboardPage
                    completedModuleIds={progress.completedModules}
                    masteredFlashcardsCount={progress.masteredFlashcards.length}
                  />
                }
              />
              <Route
                path="/modules"
                element={
                  <DashboardPage
                    completedModuleIds={progress.completedModules}
                    masteredFlashcardsCount={progress.masteredFlashcards.length}
                  />
                }
              />

              {/* Module Detail with Query Strings for Tabs */}
              <Route
                path="/modules/:id"
                element={
                  <ModuleDetailPage
                    bookmarkedIds={progress.bookmarkedQuestions}
                    onToggleBookmark={toggleBookmarkQuestion}
                    userNotes={progress.userNotes}
                    onSaveNote={saveUserNote}
                  />
                }
              />

              {/* Architecture Patterns Gallery with Vector Diagram Viewer */}
              <Route path="/architecture" element={<ArchitecturePage />} />

              {/* Exam Simulator with 130 min / 65 Questions */}
              <Route
                path="/exam-simulator"
                element={<ExamSimulatorPage onSaveResult={recordExamResult} />}
              />

              {/* 3D Spaced-Repetition Flashcards */}
              <Route
                path="/flashcards"
                element={
                  <FlashcardsPage
                    masteredIds={progress.masteredFlashcards}
                    reviewIds={progress.reviewFlashcards}
                    onMasterCard={markFlashcardMastered}
                    onReviewCard={markFlashcardReview}
                  />
                }
              />

              {/* Decision Matrices & Exam Cheat Sheets */}
              <Route path="/cheatsheets" element={<CheatSheetsPage />} />

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          {/* Clean Modern Pro Footer */}
          <footer
            className="border-t py-6 px-6 text-xs font-mono transition-colors"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  AWS SAA-C03 Solutions Architect Learning & Exam Platform
                </span>
                <div className="mt-1 text-[11px] flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                  <span>Source Knowledge Base:</span>
                  <a
                    href="https://github.com/ChathurangaVKD/AWS-Certified-Solutions-Architect-Associate-SAA-C03"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    <span>ChathurangaVKD / AWS-SAA-C03</span>
                    <IconExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
                <div className="mt-1 text-[11px]">
                  <span>Author: </span>
                  <a
                    href={AUTHOR_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    {AUTHOR_NAME}
                  </a>
                </div>
              </div>
              <div className="text-[11px] text-center md:text-right">
                <span>Dark • Light • E-Reader Modes • 100% Offline Capable</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Command Palette IconSearch (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

export function ServerApp({ initialUrl = '/' }: { initialUrl?: string }) {
  const basePath = process.env.VITE_BASE_PATH?.replace(/\/$/, '') || '';

  return (
    <ThemeProvider>
      <MemoryRouter
        basename={basePath || undefined}
        initialEntries={[`${basePath}${initialUrl}`]}
      >
        <AppContent />
      </MemoryRouter>
    </ThemeProvider>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
