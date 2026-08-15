import React from 'react';
import { useTheme, ThemeMode } from '../../context/theme-context';
import { IconMoon, IconSun, IconBook } from '@tabler/icons-react';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { mode: 'dark', label: 'Dark', icon: IconMoon },
    { mode: 'light', label: 'Light', icon: IconSun },
    { mode: 'reader', label: 'E-Reader', icon: IconBook },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl border backdrop-blur-md ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      {options.map((opt) => {
        const isActive = theme === opt.mode;
        const Icon = opt.icon;

        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            title={`Switch to ${opt.label} mode`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'shadow-sm font-bold'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
              color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
