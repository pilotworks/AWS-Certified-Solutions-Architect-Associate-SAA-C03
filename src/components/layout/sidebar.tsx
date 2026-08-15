import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODULES_METADATA } from '../../data/modules-meta';
import { ModuleMeta } from '../../types';
import {
  IconCloud,
  IconUserShield,
  IconCpu,
  IconArchive,
  IconDatabase,
  IconTopologyStar,
  IconShieldLock,
  IconArrowsJoin,
  IconChartLine,
  IconTruckDelivery,
  IconChartHistogram,
  IconHierarchy3,
  IconCoin,
  IconClipboardCheck,
  IconSitemap,
  IconAward,
  IconStack2,
  IconCircleCheck,
  IconBolt,
  IconFileText,
  IconCompass,
} from '@tabler/icons-react';

interface SidebarProps {
  completedModuleIds: string[];
  isOpen: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  IconCloud,
  IconUserShield,
  IconCpu,
  IconArchive,
  IconDatabase,
  IconTopologyStar,
  IconShieldLock,
  IconArrowsJoin,
  IconChartLine,
  IconTruckDelivery,
  IconChartHistogram,
  IconHierarchy3,
  IconCoin,
  IconClipboardCheck,
};

export const Sidebar: React.FC<SidebarProps> = ({
  completedModuleIds,
  isOpen,
  onCloseMobile,
}) => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 border-r flex flex-col transition-all duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <IconCompass className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Core Portals
          </div>
          <div className="space-y-1 mt-1">
            <Link
              to="/"
              onClick={onCloseMobile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: isCurrent('/') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/') ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: isCurrent('/') ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <IconBolt className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Study Dashboard & Modes</span>
            </Link>

            <Link
              to="/architecture"
              onClick={onCloseMobile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: isCurrent('/architecture') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/architecture') ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: isCurrent('/architecture') ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <IconSitemap className="w-4 h-4 text-sky-500" />
              <span>Architecture Patterns Gallery</span>
            </Link>

            <Link
              to="/exam-simulator"
              onClick={onCloseMobile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: isCurrent('/exam-simulator') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/exam-simulator') ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: isCurrent('/exam-simulator') ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <IconAward className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Exam Simulator (65 Qs)</span>
            </Link>

            <Link
              to="/flashcards"
              onClick={onCloseMobile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: isCurrent('/flashcards') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/flashcards') ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: isCurrent('/flashcards') ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <IconStack2 className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>3D Flashcards Deck</span>
            </Link>

            <Link
              to="/cheatsheets"
              onClick={onCloseMobile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: isCurrent('/cheatsheets') ? 'var(--accent-bg)' : 'transparent',
                color: isCurrent('/cheatsheets') ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: isCurrent('/cheatsheets') ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <IconFileText className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Decision Matrices & Sheets</span>
            </Link>
          </div>
        </div>

        {/* 14 Modules Header */}
        <div
          className="px-5 py-2.5 border-b flex items-center justify-between text-[11px] font-bold uppercase tracking-wider"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <span>AWS Curriculum (14 Modules)</span>
          <span className="font-mono font-bold" style={{ color: 'var(--text-accent)' }}>
            {completedModuleIds.length}/{MODULES_METADATA.length}
          </span>
        </div>

        {/* Modules Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MODULES_METADATA.map((m: ModuleMeta) => {
            const Icon = ICON_MAP[m.icon] || IconCloud;
            const isSelected = location.pathname === `/modules/${m.id}` || location.pathname === `/modules/${m.slug}`;
            const isCompleted = completedModuleIds.includes(m.id);

            return (
              <Link
                key={m.id}
                to={`/modules/${m.id}`}
                onClick={onCloseMobile}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer group"
                style={{
                  backgroundColor: isSelected ? 'var(--accent-bg)' : 'transparent',
                  color: isSelected ? 'var(--text-accent)' : 'var(--text-primary)',
                  border: isSelected ? '1px solid var(--accent-border)' : '1px solid transparent',
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--text-accent)'
                      : isCompleted
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'var(--bg-elevated)',
                    color: isSelected ? '#FFFFFF' : isCompleted ? '#10B981' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {m.number < 10 ? `0${m.number}` : m.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate font-medium">
                    {m.title}
                  </div>
                  <div
                    className="text-[10px] flex items-center gap-1.5 mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span>{m.domain}</span>
                    <span>•</span>
                    <span className="font-mono">{m.examWeight}</span>
                  </div>
                </div>

                {isCompleted ? (
                  <IconCircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div
          className="p-3 border-t text-[11px] flex items-center justify-between font-mono"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <span>AWS SAA-C03</span>
          <span className="font-semibold" style={{ color: 'var(--text-accent)' }}>Ready</span>
        </div>
      </aside>
    </>
  );
};
