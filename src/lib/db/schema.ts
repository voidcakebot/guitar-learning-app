export const schemaSql = `
CREATE TABLE IF NOT EXISTS learning_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  instrument TEXT NOT NULL DEFAULT 'guitar',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_items (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES learning_profiles(id) ON DELETE CASCADE,
  entry_slug TEXT NOT NULL,
  selected_pattern_id TEXT,
  custom_title TEXT,
  status TEXT NOT NULL,
  visibility_mode TEXT NOT NULL,
  show_formula BOOLEAN NOT NULL DEFAULT TRUE,
  show_notes BOOLEAN NOT NULL DEFAULT TRUE,
  show_intervals BOOLEAN NOT NULL DEFAULT TRUE,
  show_fretboard BOOLEAN NOT NULL DEFAULT TRUE,
  show_theory BOOLEAN NOT NULL DEFAULT TRUE,
  show_alternative_voicings BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  learned_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES learning_profiles(id) ON DELETE CASCADE,
  learning_item_id TEXT NOT NULL REFERENCES learning_items(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  due_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  repetition INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_logs (
  id TEXT PRIMARY KEY,
  flashcard_id TEXT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  rating TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;
