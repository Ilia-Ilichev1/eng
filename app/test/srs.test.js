import { describe, it, expect } from 'vitest';
import { review } from '../src/lib/srs.js';

const base = { ease_factor: 2.5, interval_days: 0, repetitions: 0, lapses: 0, due_date: '', last_reviewed: null };

describe('client SRS mirror', () => {
  it('matches server SM-2 for quality 5', () => {
    const r = review(base, 5);
    expect(r.repetitions).toBe(1);
    expect(r.interval_days).toBe(1);
    expect(r.ease_factor).toBe(2.6);
  });

  it('matches server SM-2 for quality 3', () => {
    const first = review(base, 5);
    const r = review(first, 3);
    expect(r.repetitions).toBe(2);
    expect(r.interval_days).toBe(6);
    expect(r.ease_factor).toBe(2.46);
  });

  it('matches server SM-2 for quality 0', () => {
    const first = review(base, 5);
    const r = review(first, 0);
    expect(r.repetitions).toBe(0);
    expect(r.interval_days).toBe(1);
    expect(r.lapses).toBe(1);
  });

  it('rejects invalid quality', () => {
    expect(() => review(base, 6)).toThrow(RangeError);
    expect(() => review(base, -1)).toThrow(RangeError);
  });
});