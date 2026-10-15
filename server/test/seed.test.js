import { describe, it, expect } from 'vitest';
import { openDb } from '../src/db.js';
import { seed } from '../src/seed/seed.js';

describe('seed', () => {
  it('inserts lessons and words on empty db', () => {
    const db = openDb(':memory:');
    const result = seed(db);
    expect(result.skipped).toBe(false);
    expect(db.prepare('SELECT COUNT(*) AS c FROM lessons').get().c).toBe(4);
    expect(db.prepare('SELECT COUNT(*) AS c FROM exercises').get().c).toBeGreaterThanOrEqual(20);
    const words = db.prepare('SELECT COUNT(*) AS c FROM words').get().c;
    expect(words).toBeGreaterThanOrEqual(50);
    expect(words).toBeLessThanOrEqual(100);
  });

  it('is idempotent on non-empty db', () => {
    const db = openDb(':memory:');
    seed(db);
    const result = seed(db);
    expect(result.skipped).toBe(true);
    expect(db.prepare('SELECT COUNT(*) AS c FROM lessons').get().c).toBe(4);
  });

  it('every exercise has valid answer data', () => {
    const db = openDb(':memory:');
    seed(db);
    const exercises = db.prepare('SELECT * FROM exercises').all();
    for (const ex of exercises) {
      if (ex.type === 'mcq') {
        const options = db.prepare('SELECT * FROM exercise_options WHERE exercise_id = ?').all(ex.id);
        expect(options.length).toBeGreaterThanOrEqual(2);
        const correct = options.filter((o) => o.is_correct === 1);
        expect(correct.length).toBe(1);
      } else {
        const options = db.prepare('SELECT COUNT(*) AS c FROM exercise_options WHERE exercise_id = ?').get(ex.id).c;
        expect(options).toBe(0);
      }
    }
  });

  it('all seeded words are unique', () => {
    const db = openDb(':memory:');
    seed(db);
    const dupes = db.prepare('SELECT term, COUNT(*) AS c FROM words GROUP BY term HAVING c > 1').all();
    expect(dupes).toEqual([]);
  });
});