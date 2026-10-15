export function review(wordProgress, quality) {
  const q = Number(quality);
  if (!Number.isInteger(q) || q < 0 || q > 5) {
    throw new RangeError('quality must be an integer between 0 and 5');
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let reps = wordProgress.repetitions || 0;
  let interval = wordProgress.interval_days || 0;
  let lapses = wordProgress.lapses || 0;
  let ease = wordProgress.ease_factor ||  2.5;

  if (q < 3) {
    reps = 0;
    interval =1;
    lapses +=1;
  } else {
    reps +=1;
    if (reps ===1) {
      interval =1;
    } else if (reps ===2) {
      interval =6;
    } else {
      interval = Math.round(interval * ease);
    }
ease = Math.max(1.3, ease +  0.1 - (5 - q) * (0.08 + (5 - q) *  0.02));
  }

  const due = new Date(today);
  due.setDate(due.getDate() + interval);
  const dueDate = localDateStr(due);

  return {
    ease_factor: round2(ease),
    interval_days: interval,
    repetitions: reps,
    lapses: lapses,
    due_date: dueDate,
    last_reviewed: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function round2(n) {
  return Math.round(n *  100) /  100;
}

function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}