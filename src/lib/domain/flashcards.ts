import type { LibraryEntry } from '@/lib/data/library';

export type FlashcardSeed = {
  type: string;
  prompt: string;
  answer: string;
};

function notesAnswer(entry: LibraryEntry) {
  return entry.notes?.join(', ') ?? 'Not available yet.';
}

function formulaAnswer(entry: LibraryEntry) {
  return entry.formula?.join(' – ') ?? 'Not available yet.';
}

export function generateFlashcards(entry: LibraryEntry): FlashcardSeed[] {
  const cards: FlashcardSeed[] = [];

  if (entry.type === 'chord') {
    cards.push(
      {
        type: 'diagram_to_name',
        prompt: `You see the ${entry.patterns?.[0]?.name ?? 'main'} chord diagram with frets ${entry.patterns?.[0]?.stringFrets.join(' / ') ?? 'shown visually'}. Which chord is it?`,
        answer: entry.title,
      },
      {
        type: 'name_to_notes',
        prompt: `Which notes belong to ${entry.title}?`,
        answer: notesAnswer(entry),
      },
      {
        type: 'name_to_formula',
        prompt: `What is the interval formula for ${entry.title}?`,
        answer: formulaAnswer(entry),
      },
      {
        type: 'identify_root',
        prompt: `What is the root note of ${entry.title}?`,
        answer: entry.rootNote ?? 'Not available yet.',
      },
    );
  }

  if (entry.type === 'scale') {
    cards.push(
      {
        type: 'pattern_to_name',
        prompt: `You are playing the ${entry.patterns?.[0]?.name ?? 'main'} pattern for this shape. Which scale is it?`,
        answer: entry.title,
      },
      {
        type: 'name_to_notes',
        prompt: `Which notes belong to ${entry.title}?`,
        answer: notesAnswer(entry),
      },
      {
        type: 'name_to_intervals',
        prompt: `What is the interval formula for ${entry.title}?`,
        answer: formulaAnswer(entry),
      },
      {
        type: 'identify_root',
        prompt: `What is the root note of ${entry.title}?`,
        answer: entry.rootNote ?? 'Not available yet.',
      },
    );
  }

  if (entry.type === 'theory') {
    cards.push(
      {
        type: 'theory_topic',
        prompt: `What topic is ${entry.title} mainly about?`,
        answer: entry.topic ?? entry.title,
      },
      {
        type: 'identify_concept',
        prompt: `Which concept matches this summary: ${entry.summary}`,
        answer: entry.title,
      },
    );

    if (entry.formula?.length) {
      cards.push({
        type: 'theory_formula',
        prompt: `Which interval formula is central to ${entry.title}?`,
        answer: formulaAnswer(entry),
      });
    }
  }

  if (entry.patterns?.[0]) {
    cards.push({
      type: 'default_pattern',
      prompt: `What is the default practice shape or pattern for ${entry.title}?`,
      answer: entry.patterns[0].name,
    });
  }

  return cards;
}
