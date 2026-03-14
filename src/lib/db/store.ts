import { neon } from '@neondatabase/serverless';

import { generateFlashcards } from '@/lib/domain/flashcards';
import { calculateNextReview, type ReviewRating, type ReviewSchedule } from '@/lib/domain/review';
import { defaultEntrySlug, getLibraryEntry, libraryEntries } from '@/lib/data/library';
import { schemaSql } from '@/lib/db/schema';

export type Profile = {
  id: string;
  name: string;
  instrument: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type LearningItem = {
  id: string;
  profile_id: string;
  entry_slug: string;
  selected_pattern_id: string | null;
  custom_title: string | null;
  status: string;
  visibility_mode: string;
  show_formula: boolean;
  show_notes: boolean;
  show_intervals: boolean;
  show_fretboard: boolean;
  show_theory: boolean;
  show_alternative_voicings: boolean;
  notes: string | null;
  learned_at: string | null;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Flashcard = {
  id: string;
  profile_id: string;
  learning_item_id: string;
  type: string;
  prompt: string;
  answer: string;
  is_active: boolean;
  due_at: string;
  interval_days: number;
  ease_factor: number;
  repetition: number;
  lapses: number;
};

export type DashboardData = {
  profile: Profile;
  learningItems: Array<LearningItem & { entryTitle: string; entryType: string }>;
  dueCards: Flashcard[];
  recommendations: typeof libraryEntries;
};

const inMemory = createMemoryStore();
let initialized = false;

function getSql() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL;
  if (!url) return null;
  return neon(url);
}

export async function ensureDb() {
  if (initialized) return;
  const sql = getSql();
  if (!sql) {
    initialized = true;
    return;
  }
  await sql.query(schemaSql);
  initialized = true;
}

export async function getOrCreateDefaultProfile() {
  await ensureDb();
  const sql = getSql();
  if (!sql) return inMemory.getOrCreateDefaultProfile();

  const existing = (await sql`SELECT * FROM learning_profiles ORDER BY created_at ASC LIMIT 1`) as Profile[];
  if (existing[0]) return existing[0];

  const id = crypto.randomUUID();
  const rows = (await sql`
    INSERT INTO learning_profiles (id, name, description)
    VALUES (${id}, ${'Guitar Fundamentals'}, ${'Default MVP learning profile'})
    RETURNING *
  `) as Profile[];
  return rows[0];
}

export async function createLearningItem(input: {
  profileId: string;
  entrySlug: string;
  visibilityMode: string;
  note?: string;
}) {
  await ensureDb();
  const entry = getLibraryEntry(input.entrySlug) ?? getLibraryEntry(defaultEntrySlug)!;
  const firstPattern = entry.patterns?.[0];
  const cards = generateFlashcards(entry);
  const sql = getSql();
  if (!sql) return inMemory.createLearningItem(input, cards, firstPattern?.id ?? null);

  const id = crypto.randomUUID();
  const itemRows = (await sql`
    INSERT INTO learning_items (
      id, profile_id, entry_slug, selected_pattern_id, status, visibility_mode,
      notes, learned_at, show_formula, show_notes, show_intervals, show_fretboard, show_theory
    ) VALUES (
      ${id}, ${input.profileId}, ${entry.slug}, ${firstPattern?.id ?? null}, ${'learning'}, ${input.visibilityMode},
      ${input.note ?? null}, NOW(), ${true}, ${true}, ${true}, ${true}, ${true}
    )
    RETURNING *
  `) as LearningItem[];

  for (const card of cards) {
    await sql`
      INSERT INTO flashcards (id, profile_id, learning_item_id, type, prompt, answer)
      VALUES (${crypto.randomUUID()}, ${input.profileId}, ${id}, ${card.type}, ${card.prompt}, ${card.answer})
    `;
  }

  return itemRows[0];
}

export async function getDashboardData(): Promise<DashboardData> {
  await ensureDb();
  const profile = await getOrCreateDefaultProfile();
  const sql = getSql();
  if (!sql) return inMemory.getDashboardData(profile.id);

  const learningItems = (await sql`
    SELECT * FROM learning_items WHERE profile_id = ${profile.id} ORDER BY created_at DESC
  `) as LearningItem[];

  const dueCards = (await sql`
    SELECT * FROM flashcards
    WHERE profile_id = ${profile.id} AND is_active = TRUE AND due_at <= NOW()
    ORDER BY due_at ASC
  `) as Flashcard[];

  const learningItemsWithLibrary = learningItems.map((item) => {
    const entry = getLibraryEntry(item.entry_slug);
    return {
      ...item,
      entryTitle: entry?.title ?? item.entry_slug,
      entryType: entry?.type ?? 'unknown',
    };
  });

  const learnedSlugs = new Set(learningItems.map((item) => item.entry_slug));
  const recommendations = libraryEntries.filter((entry) => !learnedSlugs.has(entry.slug)).slice(0, 3);

  return { profile, learningItems: learningItemsWithLibrary, dueCards, recommendations };
}

export async function getDueReviewCards() {
  const { profile } = await getDashboardData();
  const sql = getSql();
  if (!sql) return inMemory.getDueReviewCards(profile.id);

  return (await sql`
    SELECT * FROM flashcards
    WHERE profile_id = ${profile.id} AND is_active = TRUE AND due_at <= NOW()
    ORDER BY due_at ASC
    LIMIT 12
  `) as Flashcard[];
}

export async function submitReview(input: { flashcardId: string; rating: ReviewRating }) {
  await ensureDb();
  const sql = getSql();
  if (!sql) return inMemory.submitReview(input);

  const cards = (await sql`SELECT * FROM flashcards WHERE id = ${input.flashcardId} LIMIT 1`) as Flashcard[];
  const card = cards[0];
  if (!card) throw new Error('Flashcard not found');

  const next = calculateNextReview({
    dueAt: new Date(card.due_at),
    intervalDays: card.interval_days,
    easeFactor: card.ease_factor,
    repetition: card.repetition,
    lapses: card.lapses,
  }, input.rating);

  await sql`
    UPDATE flashcards
    SET due_at = ${next.dueAt.toISOString()}, interval_days = ${next.intervalDays}, ease_factor = ${next.easeFactor},
        repetition = ${next.repetition}, lapses = ${next.lapses}, updated_at = NOW()
    WHERE id = ${card.id}
  `;

  await sql`
    INSERT INTO review_logs (id, flashcard_id, rating)
    VALUES (${crypto.randomUUID()}, ${card.id}, ${input.rating})
  `;

  await sql`
    UPDATE learning_items
    SET last_reviewed_at = NOW(), updated_at = NOW(), status = ${next.repetition >= 3 ? 'reviewing' : 'learning'}
    WHERE id = ${card.learning_item_id}
  `;

  return next;
}

function createMemoryStore() {
  const profile: Profile = {
    id: 'memory-profile',
    name: 'Guitar Fundamentals',
    instrument: 'guitar',
    description: 'In-memory fallback profile used when DATABASE_URL is not set.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const learningItems: LearningItem[] = [];
  const flashcards: Flashcard[] = [];

  return {
    async getOrCreateDefaultProfile() {
      return profile;
    },
    async createLearningItem(
      input: { profileId: string; entrySlug: string; visibilityMode: string; note?: string },
      cards: ReturnType<typeof generateFlashcards>,
      patternId: string | null,
    ) {
      const item: LearningItem = {
        id: crypto.randomUUID(),
        profile_id: input.profileId,
        entry_slug: input.entrySlug,
        selected_pattern_id: patternId,
        custom_title: null,
        status: 'learning',
        visibility_mode: input.visibilityMode,
        show_formula: true,
        show_notes: true,
        show_intervals: true,
        show_fretboard: true,
        show_theory: true,
        show_alternative_voicings: false,
        notes: input.note ?? null,
        learned_at: new Date().toISOString(),
        last_reviewed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      learningItems.unshift(item);
      for (const card of cards) {
        flashcards.push({
          id: crypto.randomUUID(),
          profile_id: input.profileId,
          learning_item_id: item.id,
          type: card.type,
          prompt: card.prompt,
          answer: card.answer,
          is_active: true,
          due_at: new Date().toISOString(),
          interval_days: 0,
          ease_factor: 2.5,
          repetition: 0,
          lapses: 0,
        });
      }
      return item;
    },
    async getDashboardData(profileId: string) {
      const dueCards = flashcards.filter((card) => card.profile_id === profileId);
      const learningItemsWithLibrary = learningItems
        .filter((item) => item.profile_id === profileId)
        .map((item) => {
          const entry = getLibraryEntry(item.entry_slug);
          return {
            ...item,
            entryTitle: entry?.title ?? item.entry_slug,
            entryType: entry?.type ?? 'unknown',
          };
        });
      const learnedSlugs = new Set(learningItems.map((item) => item.entry_slug));
      return {
        profile,
        learningItems: learningItemsWithLibrary,
        dueCards,
        recommendations: libraryEntries.filter((entry) => !learnedSlugs.has(entry.slug)).slice(0, 3),
      };
    },
    async getDueReviewCards(profileId: string) {
      return flashcards.filter((card) => card.profile_id === profileId);
    },
    async submitReview(input: { flashcardId: string; rating: ReviewRating }) {
      const card = flashcards.find((candidate) => candidate.id === input.flashcardId);
      if (!card) throw new Error('Flashcard not found');
      const next: ReviewSchedule = calculateNextReview({
        dueAt: new Date(card.due_at),
        intervalDays: card.interval_days,
        easeFactor: card.ease_factor,
        repetition: card.repetition,
        lapses: card.lapses,
      }, input.rating);
      card.due_at = next.dueAt.toISOString();
      card.interval_days = next.intervalDays;
      card.ease_factor = next.easeFactor;
      card.repetition = next.repetition;
      card.lapses = next.lapses;
      return next;
    },
  };
}
