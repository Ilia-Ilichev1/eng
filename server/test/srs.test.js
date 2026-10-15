import { describe, it, expect } from 'vitest';
import { review } from '../src/srs.js';

const base = { ease_factor: 2.5, interval_days: 0, repetitions: 0, lapses: 0, due_date: '', last_reviewed: null };

describe('SM-2 review', () => {
  it('first review with quality 5: interval 1, ease 2.6', () => {
    const r = review(base, 5);
    expect(r.repetitions).toBe(1);
    expect(r.interval_days).toBe(1);
    expect(r.ease_factor).toBe(2.6);
    expect(r.lapses).toBe(0);
    const expected = new Date();
    expected.setHours(0, 0, 0, 0);
    expected.setDate(expected.getDate() + 1);
    const y = expected.getFullYear();
    const m = String(expected.getMonth() + 1).padStart(2, '0');
    const d = String(expected.getDate()).padStart(2, '0');
    expect(r.due_date).toBe(`${y}-${m}-${d}`);
  });

  it('second review quality 3: interval 6, ease decreases', () => {
    const first = review(base, 5);
    const r = review(first, 3);
    expect(r.repetitions).toBe(2);
    expect(r.interval_days).toBe(6);
    expect(r.ease_factor).toBe(2.46);
    expect(r.lapses).toBe(0);
  });

  it('third review quality 5: interval rounds interval * ease', () => {
    const first = review(base, 5);
    const second = review(first, 3);
    const r = review(second, 5);
    expect(r.repetitions).toBe(3);
    expect(r.interval_days).toBe(Math.round(6 * 2.46));
    expect(r.ease_factor).toBeCloseTo(2.56, 2);
  });

  it('quality below 3 resets schedule and increments lapses', () => {
    const first = review(base, 5);
    const r = review(first, 1);
    expect(r.repetitions).toBe(0);
    expect(r.interval_days).toBe(1);
    expect(r.lapses).toBe(1);
    expect(r.ease_factor).toBe(2.6);
  });

  it('ease factor never drops below 1.3', () => {
    let progress = { ...base, ease_factor: 1.3 };
    for (let i = 0; i < 10; i += 1) {
      progress = review(progress, 0);
    }
    expect(progress.ease_factor).toBeGreaterThanOrEqual(1.3);
  });

  it('rejects invalid quality', () => {
    expect(() => review(base, 6)).toThrow(RangeError);
    expect(() => review(base, -1)).toThrow(RangeError);
    expect(() => review(base, 2.5)).toThrow(RangeError);
  });
});