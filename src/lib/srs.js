import { todayStr } from './storage.js';

/**
 * SM-2 adapted for Hifz review.
 * Ratings: 'easy' (q=5), 'hard' (q=3), 'many mistakes' (q=0)
 *
 * @param {object} page  - current page record from state
 * @param {'easy'|'hard'|'many mistakes'} rating
 * @returns {object} updated page record
 */
export function scheduleReview(page, rating) {
  const q = rating === 'easy' ? 5 : rating === 'hard' ? 3 : 0;
  const { interval, easeFactor, reviewCount } = page;

  // SM-2 ease factor update: clamped to [1.3, 2.5]
  const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const newEase = Math.min(2.5, Math.max(1.3, easeFactor + efDelta));

  let newInterval;
  if (q < 3) {
    // Failed: reset to 1 day
    newInterval = 1;
  } else if (reviewCount === 0) {
    // First ever review: come back tomorrow regardless
    newInterval = 1;
  } else if (reviewCount === 1) {
    // Second review: short ramp-up
    newInterval = q >= 4 ? 6 : 3;
  } else {
    // Steady state
    if (q >= 4) {
      newInterval = Math.round(interval * newEase);
    } else {
      // Hard: grow slowly (at least 1 extra day)
      newInterval = Math.max(interval + 1, Math.round(interval * 1.2));
    }
  }

  const due = new Date();
  due.setDate(due.getDate() + newInterval);
  const dueDate = due.toISOString().split('T')[0];

  return { ...page, interval: newInterval, easeFactor: newEase, dueDate, reviewCount: reviewCount + 1, lastRating: rating };
}

/**
 * Returns up to `quota` pages sorted by dueDate ascending (most overdue first).
 * Pages that are not yet due are included if we don't have enough overdue ones.
 *
 * @param {object} pages  - state.pages map
 * @param {number} quota
 * @returns {Array<{num: number, ...}>}
 */
export function getSessionQueue(pages, quota) {
  return Object.entries(pages)
    .map(([num, data]) => ({ num: Number(num), ...data }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, quota);
}

/**
 * Daily review quota: 10% of memorized pages, minimum 1.
 */
export function calcQuota(memorizedPageCount) {
  return Math.max(1, Math.ceil(memorizedPageCount * 0.1));
}
