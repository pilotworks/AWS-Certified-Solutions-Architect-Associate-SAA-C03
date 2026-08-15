import React, { useState } from 'react';
import { FlashcardItem } from '../../types';
import { IconRotateClockwise, IconCheck, IconClock, IconBulb } from '@tabler/icons-react';
import { Badge } from '../ui/badge';

interface Flashcard3DProps {
  card: FlashcardItem;
  onMastered?: () => void;
  onReview?: () => void;
  isMastered?: boolean;
}

export const Flashcard3D: React.FC<Flashcard3DProps> = ({
  card,
  onMastered,
  onReview,
  isMastered = false,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective-1000 my-4 select-none">
      <div
        onClick={handleFlip}
        className={`relative w-full h-[min(420px,calc(100dvh-10rem))] min-h-[300px] md:h-[380px] md:min-h-[340px] transform-style-3d transition-transform duration-500 cursor-pointer rounded-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-6 md:p-8 flex flex-col border shadow-lg transition-colors overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="flex items-center justify-between gap-2 mb-4">
              <Badge variant="orange" size="md">
                {card.category}
              </Badge>
              {isMastered && (
                <Badge variant="emerald" size="sm">
                  <IconCheck className="w-3 h-3" /> Mastered
                </Badge>
              )}
            </div>

            <h3
              className="text-base md:text-lg font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {card.title}
            </h3>

            <p
              className="text-sm md:text-base leading-relaxed break-words"
              style={{ color: 'var(--text-secondary)' }}
            >
              {card.front}
            </p>
          </div>

          <div
            className="shrink-0 flex items-center justify-between pt-4 border-t text-xs font-medium"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            <span className="flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>
              <IconRotateClockwise className="w-3.5 h-3.5" /> Click or tap card to flip
            </span>
            <span className="font-mono">QUESTION</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-6 md:p-8 flex flex-col border shadow-lg transition-colors overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="flex items-center justify-between gap-2 mb-3">
              <Badge variant="cyan" size="md">
                Solution & Key Facts
              </Badge>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-accent)' }}>
                ANSWER
              </span>
            </div>

            <div
              className="text-sm md:text-base leading-relaxed mb-4 whitespace-pre-line break-words font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {card.back}
            </div>

            {card.examTip && (
              <div
                className="p-3 rounded-lg text-xs flex items-start gap-2 border"
                style={{
                  backgroundColor: 'var(--accent-bg)',
                  borderColor: 'var(--accent-border)',
                  color: 'var(--text-accent)',
                }}
              >
                <IconBulb className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Exam Tip:</strong> {card.examTip}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons on card back */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center justify-between gap-3 pt-3 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              onClick={onReview}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <IconClock className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} /> Review Later
            </button>
            <button
              onClick={onMastered}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#10B981',
              }}
            >
              <IconCheck className="w-3.5 h-3.5" /> Mastered
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
