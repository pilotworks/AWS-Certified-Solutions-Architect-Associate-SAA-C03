import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layers, FileText, Award, Workflow, X } from 'lucide-react';
import { MODULES_METADATA } from '../../data/modules-meta';
import { ModuleMeta } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule?: (moduleId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : {};
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredModules = MODULES_METADATA.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.domain.toLowerCase().includes(query.toLowerCase()) ||
      m.id.toLowerCase().includes(query.toLowerCase())
  );

  const staticNavigations = [
    { title: 'Full Exam Simulator (65 Questions, 130 min)', path: '/exam-simulator', icon: Award },
    { title: 'Architecture Patterns & Vector Diagram Gallery', path: '/architecture', icon: Workflow },
    { title: 'Interactive 3D Flashcards (Spaced Repetition)', path: '/flashcards', icon: Layers },
    { title: 'Decision Matrices & Exam Cheat Sheets', path: '/cheatsheets', icon: FileText },
  ].filter((nav) => nav.title.toLowerCase().includes(query.toLowerCase()));

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleModuleClick = (moduleId: string) => {
    if (onSelectModule) {
      onSelectModule(moduleId);
    } else {
      navigate(`/modules/${moduleId}`);
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Search Input Bar */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--text-accent)' }} />
          <input
            type="text"
            placeholder="Search AWS services, modules, cheatsheets, or exams... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent focus:outline-none text-sm md:text-base font-medium"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:opacity-100 opacity-60 cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          {/* Quick Actions / Navigation */}
          {staticNavigations.length > 0 && (
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Quick Portals
              </div>
              <div className="space-y-1">
                {staticNavigations.map((nav, idx) => {
                  const Icon = nav.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleNavClick(nav.path)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all group"
                      style={{
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon
                        className="w-4 h-4 group-hover:scale-110 transition-transform"
                        style={{ color: 'var(--text-accent)' }}
                      />
                      <span className="font-medium flex-1">{nav.title}</span>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        Jump ↵
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modules List */}
          {filteredModules.length > 0 && (
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1"
                style={{ color: 'var(--text-muted)' }}
              >
                AWS Modules (14 Topics)
              </div>
              <div className="space-y-1">
                {filteredModules.map((m: ModuleMeta) => (
                  <div
                    key={m.id}
                    onClick={() => handleModuleClick(m.id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent cursor-pointer text-sm transition-all group"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
                      e.currentTarget.style.borderColor = 'var(--accent-border)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-accent)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {m.number < 10 ? `0${m.number}` : m.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {m.title}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {m.domain} • Weight: {m.examWeight}
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {m.timeEstimates.fastLearn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredModules.length === 0 && staticNavigations.length === 0 && (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
              No results found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2 border-t text-[11px] flex items-center justify-between font-mono"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Navigate with ↵ or click</span>
          <span>AWS SAA-C03 Hub</span>
        </div>
      </div>
    </div>
  );
};
