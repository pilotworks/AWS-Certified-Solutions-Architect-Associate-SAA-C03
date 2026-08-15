import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconSearch, IconAward, IconStack2, IconMenu2, IconSitemap, IconFileText } from '@tabler/icons-react';
import { IconBrandGithub } from '@tabler/icons-react';
import { ThemeSwitcher } from '../ui/theme-switcher';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  overallProgressPercent: number;
}

const assetBaseUrl = import.meta.env?.BASE_URL || '/';

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onToggleSidebar,
  overallProgressPercent,
}) => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-full gap-3">
        {/* Left Side: Mobile Menu Button & App Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <IconMenu2 className="w-5 h-5" />
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-2.5 cursor-pointer group">
            <img
              src={`${assetBaseUrl}icons/icon-192.svg`}
              alt="AWS SAA-C03 Hub"
              className="w-9 h-9 rounded-xl shadow-sm transition-transform group-hover:scale-105"
            />
            <div className="hidden min-w-0 max-w-[105px] sm:block sm:max-w-none">
              <div
                className="flex items-center gap-1.5 truncate whitespace-nowrap font-extrabold text-sm tracking-tight md:text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                SAA-C03 Hub
                <span
                  className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-mono font-bold tracking-wider rounded"
                  style={{
                    backgroundColor: 'var(--accent-bg)',
                    color: 'var(--text-accent)',
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  Architect
                </span>
              </div>
              <div className="hidden sm:block text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                Solutions Architect Associate
              </div>
            </div>
          </Link>
        </div>

        {/* Center: IconSearch Trigger (Cmd + K) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer border"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="flex items-center gap-2">
              <IconSearch className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Search services, cheatsheets, questions...</span>
            </span>
            <kbd
              className="px-2 py-0.5 rounded font-mono text-[10px] border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Quick Action Tabs & Progress */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="md:hidden p-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <IconSearch className="w-4 h-4" />
          </button>

          {/* Quick Nav Buttons */}
          <div
            className="hidden lg:flex items-center gap-1 p-1 rounded-xl border text-xs"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: isCurrent('/') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/') ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontWeight: isCurrent('/') ? 600 : 500,
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/architecture"
              className="px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              style={{
                backgroundColor: isCurrent('/architecture') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/architecture') ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontWeight: isCurrent('/architecture') ? 600 : 500,
              }}
            >
              <IconSitemap className="w-3.5 h-3.5 text-sky-500" /> Architecture
            </Link>
            <Link
              to="/cheatsheets"
              className="px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              style={{
                backgroundColor: isCurrent('/cheatsheets') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/cheatsheets') ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontWeight: isCurrent('/cheatsheets') ? 600 : 500,
              }}
            >
              <IconFileText className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Matrices
            </Link>
            <Link
              to="/flashcards"
              className="px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              style={{
                backgroundColor: isCurrent('/flashcards') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/flashcards') ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontWeight: isCurrent('/flashcards') ? 600 : 500,
              }}
            >
              <IconStack2 className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Flashcards
            </Link>
            <Link
              to="/exam-simulator"
              className="px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              style={{
                backgroundColor: isCurrent('/exam-simulator') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/exam-simulator') ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontWeight: isCurrent('/exam-simulator') ? 600 : 500,
              }}
            >
              <IconAward className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Exam Simulator
            </Link>
          </div>

          {/* 3-Mode Theme Switcher (Dark, Light, E-Reader) */}
          <a
            href="https://github.com/pilotworks/AWS-Certified-Solutions-Architect-Associate-SAA-C03"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open GitHub repository"
            title="GitHub repository"
            className="p-2 rounded-lg border transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <IconBrandGithub className="w-4 h-4" stroke={1.8} />
          </a>
          <ThemeSwitcher />

          {/* Progress Indicator */}
          <div
            className="flex items-center gap-2 pl-2 border-l"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
                Mastery
              </div>
              <div className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>
                {overallProgressPercent}%
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center relative"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  style={{ stroke: 'var(--border-subtle)' }}
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  style={{ stroke: 'var(--text-accent)' }}
                  strokeDasharray={`${overallProgressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
