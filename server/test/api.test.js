import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { openDb } from '../src/db.js';
import { seed } from '../src/seed/seed.js';
import { createApp } from '../src/index.js';

function setup() {
  const db = openDb(':memory:');
  seed(db);
  const app = createApp(db);
  return { db, app };
}

describe('API', () => {
  let db;
  let app;

  beforeEach(() => {
    ({ db, app } = setup());
  });

  it('GET /api/lessons returns lessons in order', async () => {
    const res = await request(app).get('/api/lessons');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
    expect(res.body[0]).toMatchObject({ title: 'Greetings and Introductions' });
    expect(res.body[0].order).toBe(1);
  });

  it('GET /api/lessons/:id returns lesson with exercises and options', async () => {
    const res = await request(app).get('/api/lessons/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Greetings and Introductions');
    expect(res.body.exercises.length).toBeGreaterThanOrEqual(5);
    const mcq = res.body.exercises.find((e) => e.type === 'mcq');
    expect(mcq.options.length).toBeGreaterThanOrEqual(2);
    const correct = mcq.options.filter((o) => o.is_correct);
    expect(correct.length).toBe(1);
    expect(mcq.answer).toBe(correct[0].text);
    const fill = res.body.exercises.find((e) => e.type === 'fill_blank');
    expect(typeof fill.answer).toBe('string');
  });

  it('GET /api/lessons/:id returns 404 for unknown', async () => {
    const res = await request(app).get('/api/lessons/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/lessons/:id/attempts records batch', async () => {
    const res = await request(app).post('/api/lessons/1/attempts').send({
      attempts: [
        { exercise_id: 1, answer: 'Good morning', is_correct: true },
        { exercise_id: 2, answer: 'name', is_correct: true },
      ],
    });
    expect(res.status).toBe(201);
    expect(res.body.inserted).toBe(2);
    const stats = await request(app).get('/api/stats');
    expect(stats.body.attempts_total).toBe(2);
    expect(stats.body.lessons_completed).toBe(1);
    expect(stats.body.streak).toBe(1);
  });

  it('POST attempts for unknown lesson returns 404', async () => {
    const res = await request(app).post('/api/lessons/999/attempts').send({
      attempts: [{ exercise_id: 1, answer: 'x', is_correct: true }],
    });
    expect(res.status).toBe(404);
  });

  it('GET /api/dictionary searches by term', async () => {
    const res = await request(app).get('/api/dictionary').query({ q: 'apple' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].term).toBe('apple');
    expect(res.body[0].tags).toEqual(['food', 'fruit']);
  });

  it('GET /api/dictionary filters by level', async () => {
    const res = await request(app).get('/api/dictionary').query({ level: 'A2' });
    expect(res.status).toBe(200);
    expect(res.body.every((w) => w.level === 'A2')).toBe(true);
  });

  it('GET /api/dictionary/:id returns word with progress', async () => {
    const res = await request(app).get('/api/dictionary/1');
    expect(res.status).toBe(200);
    expect(res.body.term).toBe('hello');
    expect(res.body.progress).toBeNull();
  });

  it('GET /api/dictionary/:id 404 for unknown', async () => {
    const res = await request(app).get('/api/dictionary/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/words/:id/review updates progress', async () => {
    const res = await request(app).post('/api/words/1/review').send({ quality: 5 });
    expect(res.status).toBe(200);
    expect(res.body.repetitions).toBe(1);
    expect(res.body.interval_days).toBe(1);
    const again = await request(app).post('/api/words/1/review').send({ quality: 1 });
    expect(again.body.lapses).toBe(1);
    expect(again.body.repetitions).toBe(0);
  });

  it('review rejects invalid quality', async () => {
    const res = await request(app).post('/api/words/1/review').send({ quality: 7 });
    expect(res.status).toBe(400);
  });

  it('review unknown word returns 404', async () => {
    const res = await request(app).post('/api/words/999/review').send({ quality: 5 });
    expect(res.status).toBe(404);
  });

  it('GET /api/reviews/due returns words without progress as due', async () => {
    const res = await request(app).get('/api/reviews/due').query({ limit: 3 });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].progress).toBeNull();
    const reviewRes = await request(app).post('/api/words/1/review').send({ quality: 0 });
    expect(reviewRes.body.due_date).toBeTruthy();
    const dict = await request(app).get('/api/dictionary/1');
    expect(dict.body.progress.due_date).toBeTruthy();
  });

  it('GET /api/stats empty returns zeros', async () => {
    const fresh = openDb(':memory:');
    seed(fresh);
    const app2 = createApp(fresh);
    const res = await request(app2).get('/api/stats');
    expect(res.body).toMatchObject({
      lessons_total: 4,
      lessons_completed: 0,
      attempts_total: 0,
      accuracy: 0,
      due_reviews: 0,
      streak: 0,
    });
  });

  it('streak handles consecutive days', async () => {
    const day = (offset) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + offset);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    };
    db.prepare("INSERT INTO exercise_attempts (exercise_id, answer, is_correct, answered_at) VALUES (?, ?, ?, ?)")
      .run(1, 'a', 1, `${day(0)} 10:00:00`);
    db.prepare("INSERT INTO exercise_attempts (exercise_id, answer, is_correct, answered_at) VALUES (?, ?, ?, ?)")
      .run(2, 'b', 1, `${day(-1)} 10:00:00`);
    const res = await request(app).get('/api/stats');
    expect(res.body.streak).toBe(2);
  });
});