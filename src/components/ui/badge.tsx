import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'orange' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  const variantStyles = {
    default: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
    orange: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-semibold',
    cyan: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30 font-semibold',
    emerald: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-semibold',
    amber: 'bg-yellow-500/15 text-amber-800 dark:text-yellow-300 border-yellow-500/30 font-semibold',
    rose: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30 font-semibold',
    purple: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wide',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
