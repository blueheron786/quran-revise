import { navigate } from '../router.js';
import { initState, saveState } from '../lib/storage.js';
import { getPagesForJuz, juzMap } from '../lib/quran.js';

export function renderOnboarding(container) {
  const selected = new Set();

  const countPages = () => {
    let total = 0;
    for (const j of selected) total += getPagesForJuz(j).length;
    return total;
  };

  const render = () => {
    container.innerHTML = `
      <div class="onboarding">
        <h1>Hifz Review</h1>
        <p class="subtitle">Select the juz you have memorized</p>
        <div class="juz-grid">
          ${juzMap.map(j => `
            <button class="juz-tile${selected.has(j.juz) ? ' selected' : ''}" data-juz="${j.juz}" aria-pressed="${selected.has(j.juz)}">
              <span class="juz-num">Juz ${j.juz}</span>
              <span class="juz-surah">${j.firstSurah}</span>
              <span class="juz-pages">${j.pageStart}–${j.pageEnd}</span>
            </button>
          `).join('')}
        </div>
        <div class="onboarding-footer">
          <p class="selection-info">
            ${selected.size > 0 ? `${selected.size} juz · ${countPages()} pages selected` : 'Select at least one juz to begin'}
          </p>
          <button class="btn-primary" id="begin-btn" ${selected.size === 0 ? 'disabled' : ''}>Begin</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.juz-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const juz = Number(tile.dataset.juz);
        if (selected.has(juz)) selected.delete(juz);
        else selected.add(juz);
        render();
      });
    });

    container.querySelector('#begin-btn')?.addEventListener('click', () => {
      const memorizedJuz = [...selected].sort((a, b) => a - b);
      const pagesByJuz = [];
      for (const juzNum of memorizedJuz) {
        for (const page of getPagesForJuz(juzNum)) {
          pagesByJuz.push([page, juzNum]);
        }
      }
      saveState(initState(memorizedJuz, pagesByJuz));
      navigate('/home');
    });
  };

  render();
}
