import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FLASHCARDS_DATA } from '../data/flashcards';
import { getDocContent, parseFlashcards } from '../utils/content-loader';
import { FlashcardDeck } from '../components/flashcard/flashcard-deck';
import { PageHead } from '../components/seo/page-head';
import { IconStack2 } from '@tabler/icons-react';

interface FlashcardsPageProps {
  masteredIds?: string[];
  reviewIds?: string[];
  onMasterCard?: (id: string) => void;
  onReviewCard?: (id: string) => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({
  masteredIds = [],
  reviewIds = [],
  onMasterCard,
  onReviewCard,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawMarkdown = getDocContent('study-guides/FLASHCARDS.md');
  const cards = FLASHCARDS_DATA.length > 0 ? FLASHCARDS_DATA : parseFlashcards(rawMarkdown);

  const activeCategory = searchParams.get('category') || 'All';

  const handleCategoryChange = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <PageHead
        title="Interactive 3D Flashcards"
        description="Master AWS SAA-C03 core architectural trade-offs, service scenarios, and exam keywords with 3D spaced-repetition flashcards."
        keywords={['AWS Flashcards', '3D Flashcards', 'SAA-C03 Flashcards', 'Active Recall', 'Spaced Repetition']}
        canonicalPath="/flashcards"
      />

      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 md:p-8 border text-center shadow-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{
            backgroundColor: 'var(--accent-bg)',
            color: 'var(--text-accent)',
            border: '1px solid var(--accent-border)',
          }}
        >
          <IconStack2 className="w-3.5 h-3.5" /> 3D Spaced-Repetition Deck
        </div>
        <h1
          className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          AWS SAA-C03 Interactive Flashcards
        </h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Flip through scenario-driven flashcards, master core service trade-offs, and solidify exam keywords with instant feedback.
        </p>
      </div>

      {/* Interactive Deck Component */}
      <FlashcardDeck
        cards={cards}
        masteredIds={masteredIds}
        reviewIds={reviewIds}
        onMasterCard={onMasterCard}
        onReviewCard={onReviewCard}
        initialCategory={activeCategory}
        onCategorySelect={handleCategoryChange}
      />
    </div>
  );
};
