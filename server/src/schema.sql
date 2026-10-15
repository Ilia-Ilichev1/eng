CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'A1',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'fill_blank', 'translation')),
  prompt TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  answer TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS exercise_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL UNIQUE,
  translation TEXT NOT NULL,
  definition TEXT NOT NULL DEFAULT '',
  example TEXT NOT NULL DEFAULT '',
  part_of_speech TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'A1',
  tags TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS word_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER NOT NULL UNIQUE REFERENCES words(id) ON DELETE CASCADE,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL DEFAULT '',
  last_reviewed TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exercise_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  answer TEXT NOT NULL DEFAULT '',
  is_correct INTEGER NOT NULL DEFAULT 0,
  answered_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON exercises(lesson_id, "order");
CREATE INDEX IF NOT EXISTS idx_options_exercise ON exercise_options(exercise_id, "order");
CREATE INDEX IF NOT EXISTS idx_attempts_exercise ON exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_progress_due ON word_progress(due_date);
CREATE INDEX IF NOT EXISTS idx_words_level ON words(level);