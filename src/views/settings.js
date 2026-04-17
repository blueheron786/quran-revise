import { loadState, saveState, clearState, todayStr } from '../lib/storage.js';
import { getPagesForJuz, juzMap } from '../lib/quran.js';
import { navigate } from '../router.js';

export function renderSettings(container) {
  const state = loadState();
  if (!state) { navigate('/onboarding'); return; }

  const unmemorizedJuz = juzMap.filter(j => !state.memorizedJuz.includes(j.juz));

  container.innerHTML = `
    <div class="settings">
      <header class="page-header">
        <h1>Settings</h1>
      </header>

      <section class="settings-section card">
        <h2>Add memorized juz</h2>
        ${unmemorizedJuz.length === 0
          ? `<p>You have memorized all 30 juz — masha'Allah! <span aria-hidden="true">🎉</span></p>`
          : `<p>Tap a juz to add it to your review schedule. Pages will be due immediately.</p>
             <div class="add-juz-grid">
               ${unmemorizedJuz.map(j => `
                 <button class="juz-add-tile" data-juz="${j.juz}" aria-label="Add Juz ${j.juz}">
                   <span class="tile-num">Juz ${j.juz}</span>
                   <span class="tile-sub">${j.firstSurah}</span>
                   <span class="tile-pages">${j.pageStart}–${j.pageEnd}</span>
                 </button>
               `).join('')}
             </div>`
        }
      </section>

      <section class="settings-section card danger-zone">
        <h2>Reset data</h2>
        <p>Deletes all progress and review history. This cannot be undone.</p>
        <button class="btn-danger" id="reset-btn">Reset all data</button>
      </section>

      <nav class="bottom-nav" aria-label="Main navigation">
        <button class="nav-btn" data-route="/home">Home</button>
        <button class="nav-btn" data-route="/stats">Stats</button>
        <button class="nav-btn active" data-route="/settings">Settings</button>
      </nav>
    </div>
  `;

  container.querySelectorAll('.juz-add-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const juzNum = Number(tile.dataset.juz);
      const s = loadState();
      const today = todayStr();

      s.memorizedJuz = [...s.memorizedJuz, juzNum].sort((a, b) => a - b);

      for (const pageNum of getPagesForJuz(juzNum)) {
        const key = String(pageNum);
        if (!s.pages[key]) {
          s.pages[key] = { interval: 1, easeFactor: 2.5, dueDate: today, reviewCount: 0, lastRating: null, juz: juzNum };
        }
      }

      saveState(s);
      renderSettings(container); // re-render to reflect change
    });
  });

  container.querySelector('#reset-btn')?.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Reset all data? This will delete your entire progress and history.')) {
      clearState();
      navigate('/onboarding');
    }
  });

  container.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
}
