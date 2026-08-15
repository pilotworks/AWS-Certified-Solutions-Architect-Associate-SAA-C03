import React, { useState, useEffect } from 'react';
import { FlashcardItem } from '../../types';
import { Flashcard3D } from './flashcard-3d';
import { Button } from '../ui/button';
import { IconChevronLeft, IconChevronRight, IconArrowsShuffle, IconCircleCheck, IconFilter } from '@tabler/icons-react';
import { Badge } from '../ui/badge';

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  masteredIds?: string[];
  reviewIds?: string[];
  onMasterCard?: (id: string) => void;
  onReviewCard?: (id: string) => void;
  initialCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  masteredIds = [],
  reviewIds = [],
  onMasterCard,
  onReviewCard,
  initialCategory = 'All',
  onCategorySelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardDeck, setCardDeck] = useState<FlashcardItem[]>(cards);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = ['All', ...Array.from(new Set(cards.map((c) => c.category)))];

  const filteredCards = cardDeck.filter(
    (c) => selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % (filteredCards.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + (filteredCards.length || 1)) % (filteredCards.length || 1));
  };

  const handleShuffle = () => {
    const shuffled = [...cardDeck].sort(() => Math.random() - 0.5);
    setCardDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    onCategorySelect?.(cat);
  };

  return (
    <div className="space-y-6">
      {/* Category IconFilter & Controls */}
      <div
        className="rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs flex items-center gap-1 shrink-0 font-medium" style={{ color: 'var(--text-muted)' }}>
            <IconFilter className="w-3.5 h-3.5" /> Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium"
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--accent-bg)' : 'var(--bg-elevated)',
                color: selectedCategory === cat ? 'var(--text-accent)' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="emerald" className="whitespace-nowrap shrink-0">
            <IconCircleCheck className="w-3.5 h-3.5" /> Mastered: {masteredIds.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleShuffle} title="Shuffle Deck">
            <IconArrowsShuffle className="w-4 h-4" /> Shuffle
          </Button>
        </div>
      </div>

      {/* Card Display Area */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="relative py-4">
          <div className="text-center text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
            Card {currentIndex + 1} of {filteredCards.length}
          </div>

          <Flashcard3D
            key={currentCard.id}
            card={currentCard}
            isMastered={masteredIds.includes(currentCard.id)}
            onMastered={() => {
              onMasterCard?.(currentCard.id);
              handleNext();
            }}
            onReview={() => {
              onReviewCard?.(currentCard.id);
              handleNext();
            }}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              className="px-6"
            >
              <IconChevronLeft className="w-5 h-5" /> Prev
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="px-6"
            >
              Next <IconChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          No flashcards found in this domain.
        </div>
      )}
    </div>
  );
};
