import { Router } from 'express';
import { review } from '../srs.js';

export function createApi(db) {
  const router = Router();

  router.get('/lessons', (req, res) => {
    const lessons = db.prepare(
      'SELECT id, title, description, level, "order" FROM lessons ORDER BY "order", id'
    ).all();
    res.json(lessons);
  });

  router.get('/lessons/:id', (req, res) => {
    const lesson = db.prepare(
      'SELECT id, title, description, level, "order" FROM lessons WHERE id = ?'
    ).get(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    const exercises = db.prepare(
      'SELECT id, lesson_id, type, prompt, explanation, answer, "order" FROM exercises WHERE lesson_id = ? ORDER BY "order", id'
    ).all(lesson.id);
    const optionsStmt = db.prepare(
      'SELECT id, text, is_correct FROM exercise_options WHERE exercise_id = ? ORDER BY "order", id'
    );
    const withOptions = exercises.map((ex) => {
      const opts = optionsStmt.all(ex.id).map((o) => ({ ...o, is_correct: Boolean(o.is_correct) }));
      return { ...ex, options: opts, answer: getAnswer(ex, opts) };
    });
    res.json({ ...lesson, exercises: withOptions });
  });

  router.post('/lessons/:id/attempts', (req, res) => {
    const lesson = db.prepare('SELECT id FROM lessons WHERE id = ?').get(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    const attempts = Array.isArray(req.body) ? req.body : (req.body?.attempts || []);
    if (!attempts.length) {
      return res.status(400).json({ error: 'No attempts provided' });
    }
    const insert = db.prepare(
      'INSERT INTO exercise_attempts (exercise_id, answer, is_correct, answered_at) VALUES (?, ?, ?, ?)'
    );
    const now = new Date().toISOString();
    const tx = db.transaction((items) => {
      for (const a of items) {
        insert.run(a.exercise_id, String(a.answer ?? ''), a.is_correct ? 1 :  0, now);
      }
    });
    tx(attempts);
    res.status(201).json({ inserted: attempts.length });
  });

  router.get('/dictionary', (req, res) => {
    const q = String(req.query.q || '').trim().toLowerCase();
    const level = String(req.query.level || '').trim();
    let sql = 'SELECT id, term, translation, definition, example, part_of_speech, level, tags FROM words';
    const where = [];
    const params = [];
    if (q) {
      where.push('lower(term) LIKE ?');
      params.push(`%${q}%`);
    }
    if (level) {
      where.push('level = ?');
      params.push(level);
    }
    if (where.length) {
      sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' ORDER BY term LIMIT 100';
    const words = db.prepare(sql).all(...params).map((w) => ({ ...w, tags: JSON.parse(w.tags || '[]') }));
    res.json(words);
  });

  router.get('/dictionary/:id', (req, res) => {
    const word = db.prepare(
      'SELECT id, term, translation, definition, example, part_of_speech, level, tags FROM words WHERE id = ?'
    ).get(req.params.id);
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    const progress = db.prepare(
      'SELECT id, word_id, ease_factor, interval_days, repetitions, lapses, due_date, last_reviewed, updated_at FROM word_progress WHERE word_id = ?'
    ).get(word.id) || null;
    res.json({ ...word, tags: JSON.parse(word.tags || '[]'), progress });
  });

  router.post('/words/:id/review', (req, res) => {
    const word = db.prepare('SELECT id FROM words WHERE id = ?').get(req.params.id);
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    const quality = Number(req.body?.quality);
    if (!Number.isInteger(quality) || quality < 0 || quality >  5) {
      return res.status(400).json({ error: 'quality must be an integer between 0 and 5' });
    }
    let progress = db.prepare('SELECT * FROM word_progress WHERE word_id = ?').get(word.id);
    if (!progress) {
      db.prepare('INSERT INTO word_progress (word_id) VALUES (?)').run(word.id);
      progress = db.prepare('SELECT * FROM word_progress WHERE word_id = ?').get(word.id);
    }
    const updated = review(progress, quality);
    db.prepare(
      'UPDATE word_progress SET ease_factor = ?, interval_days = ?, repetitions = ?, lapses = ?, due_date = ?, last_reviewed = ?, updated_at = ? WHERE word_id = ?'
    ).run(updated.ease_factor, updated.interval_days, updated.repetitions, updated.lapses, updated.due_date, updated.last_reviewed, updated.updated_at, word.id);
    res.json(updated);
  });

  router.get('/reviews/due', (req, res) => {
    const limit = Math.min(Number(req.query.limit) ||  10,  100);
    const today = new Date();
    today.setHours(0,  0,  0,  0);
    const todayStr = localDateStr(today);
    const rows = db.prepare(
      'SELECT w.id, w.term, w.translation, w.definition, w.example, w.part_of_speech, w.level, w.tags, p.id AS progress_id, p.ease_factor, p.interval_days, p.repetitions, p.lapses, p.due_date, p.last_reviewed FROM words w LEFT JOIN word_progress p ON p.word_id = w.id WHERE p.due_date IS NULL OR (p.due_date <= ? AND p.due_date != ?) ORDER BY COALESCE(p.due_date, ?) LIMIT ?'
    ).all(todayStr, '', todayStr, limit);
    const due = rows.map((r) => ({
      ...r,
      tags: JSON.parse(r.tags || '[]'),
      progress: r.progress_id
        ? {
            id: r.progress_id,
            word_id: r.id,
            ease_factor: r.ease_factor,
            interval_days: r.interval_days,
            repetitions: r.repetitions,
            lapses: r.lapses,
            due_date: r.due_date,
            last_reviewed: r.last_reviewed,
          }
        : null,
    }));
    res.json(due);
  });

  router.get('/stats', (req, res) => {
    const lessonsTotal = db.prepare('SELECT COUNT(*) AS c FROM lessons').get().c;
    const lessonsAttempted = db.prepare(
      'SELECT COUNT(DISTINCT lesson_id) AS c FROM exercises WHERE id IN (SELECT DISTINCT exercise_id FROM exercise_attempts)'
    ).get().c;
    const attempts = db.prepare('SELECT COUNT(*) AS c FROM exercise_attempts').get().c;
    const correct = db.prepare('SELECT COUNT(*) AS c FROM exercise_attempts WHERE is_correct =  1').get().c;
    const dueReviews = db.prepare(
      "SELECT COUNT(*) AS c FROM word_progress WHERE due_date != '' AND due_date <= ?"
    ).get(todayIso()).c;
    const streak = computeStreak(db);
    res.json({
      lessons_total: lessonsTotal,
      lessons_completed: lessonsAttempted,
      attempts_total: attempts,
      accuracy: attempts ? Math.round((correct / attempts) *  100) :  0,
      due_reviews: dueReviews,
      streak,
    });
  });

  return router;
}

function getAnswer(ex, options) {
  if (ex.type === 'mcq') {
    const correct = options.find((o) => o.is_correct);
    return correct ? correct.text : null;
  }
  return ex.answer ?? null;
}

function todayIso() {
  const d = new Date();
  d.setHours(0,  0,  0,  0);
  return localDateStr(d);
}

function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function computeStreak(db) {
  const rows = db.prepare(
    "SELECT DISTINCT date(answered_at) AS day FROM exercise_attempts ORDER BY day DESC"
  ).all();
  if (!rows.length) {
    return 0;
  }
  const days = new Set(rows.map((r) => r.day));
  const today = new Date();
  today.setHours(0,  0,  0,  0);
  let cursor = new Date(today);
  if (!days.has(localDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (days.has(localDateStr(cursor))) {
    streak +=1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}