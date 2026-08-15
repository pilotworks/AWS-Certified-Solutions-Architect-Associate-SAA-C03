import React, { useState, useMemo } from 'react';
import { DecisionMatrixCategory } from '../../types';
import { IconSearch, IconCircleCheck, IconCircleX, IconStack2 } from '@tabler/icons-react';

interface DecisionMatrixTableProps {
  categories: DecisionMatrixCategory[];
  activeCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DecisionMatrixTable: React.FC<DecisionMatrixTableProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
}) => {
  const [internalCategoryId, setInternalCategoryId] = useState<string>(
    activeCategoryId || categories[0]?.id || ''
  );
  const [internalSearch, setInternalSearch] = useState<string>(searchQuery);

  const selectedCategoryId = activeCategoryId || internalCategoryId;
  const currentSearch = onSearchChange ? searchQuery : internalSearch;

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const filteredItems = useMemo(() => {
    if (!currentCategory) return [];
    if (!currentSearch.trim()) return currentCategory.items;

    const q = currentSearch.toLowerCase();
    return currentCategory.items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchBest = item.bestFor.toLowerCase().includes(q);
      const matchAvoid = item.avoidFor?.toLowerCase().includes(q) || false;
      const matchFeatures = Object.values(item.features).some((val) =>
        String(val).toLowerCase().includes(q)
      );
      return matchName || matchDesc || matchBest || matchAvoid || matchFeatures;
    });
  }, [currentCategory, currentSearch]);

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setInternalCategoryId(catId);
    }
  };

  const handleSearchInput = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  if (!currentCategory) return null;

  return (
    <div className="space-y-6">
      {/* Category Tabs & IconSearch Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => {
            const isActive = cat.id === currentCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--accent-bg)' : 'var(--bg-elevated)',
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                }}
              >
                <IconStack2
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? 'var(--text-accent)' : 'var(--text-muted)' }}
                />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* IconFilter Input */}
        <div className="relative min-w-[240px]">
          <IconSearch
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={currentSearch}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="IconSearch matrix items..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-base md:text-xs transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              borderWidth: '1px',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Active Category Header */}
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span>{currentCategory.title}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--text-accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            {filteredItems.length} options
          </span>
        </h3>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          {currentCategory.description}
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div
        className="overflow-x-auto rounded-xl border shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {currentCategory.columns.map((col) => (
                <th
                  key={col.key}
                  className="py-3 px-4 text-xs font-semibold uppercase tracking-wider font-mono first:pl-5 last:pr-5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="hover:opacity-95 transition-opacity group"
                style={{ backgroundColor: 'transparent' }}
              >
                {currentCategory.columns.map((col, idx) => {
                  const val = item.features[col.key];

                  // First column: Item Name & Badge
                  if (idx === 0) {
                    return (
                      <td key={col.key} className="py-3.5 px-4 first:pl-5 align-top">
                        <div className="font-bold flex flex-wrap items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                          <span>{item.name}</span>
                          {item.badge && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={{
                                backgroundColor: 'var(--accent-bg)',
                                color: 'var(--text-accent)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.description}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className="py-3.5 px-4 align-top" style={{ color: 'var(--text-secondary)' }}>
                      {typeof val === 'boolean' ? (
                        val ? (
                          <IconCircleCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <IconCircleX className="w-4 h-4 text-rose-500" />
                        )
                      ) : (
                        <span className="leading-relaxed">{val || '—'}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best For / Exam Traps Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={`guide-${item.id}`}
            className="p-4 rounded-xl border flex flex-col justify-between gap-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                {item.badge && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-accent)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div
                  className="flex items-start gap-2 rounded-lg p-2.5 border"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderColor: 'rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <IconCircleCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Best For:</span>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item.bestFor}</p>
                  </div>
                </div>

                {item.avoidFor && (
                  <div
                    className="flex items-start gap-2 rounded-lg p-2.5 border"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      borderColor: 'rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <IconCircleX className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">Exam Trap / Avoid When:</span>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item.avoidFor}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
