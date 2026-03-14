import type { LibraryEntry } from '@/lib/data/library';

export type FlashcardSeed = {
  type: string;
  prompt: string;
  answer: string;
};

export function generateFlashcards(entry: LibraryEntry): FlashcardSeed[] {
  const cards: FlashcardSeed[] = [
    {
      type: `identify_${entry.type}`,
      prompt: `What ${entry.type} is described here: ${entry.summary}`,
      answer: entry.title,
    },
  ];

  if (entry.formula?.length) {
    cards.push({
      type: 'name_formula',
      prompt: `What is the interval formula for ${entry.title}?`,
      answer: entry.formula.join(' – '),
    });
  }

  if (entry.notes?.length) {
    cards.push({
      type: 'name_notes',
      prompt: `Which notes belong to ${entry.title}?`,
      answer: entry.notes.join(', '),
    });
  }

  if (entry.patterns?.[0]) {
    cards.push({
      type: 'identify_pattern',
      prompt: `Which pattern is the default shape for ${entry.title}?`,
      answer: entry.patterns[0].name,
    });
  }

  return cards;
}
