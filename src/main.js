import './style.css';
import { loadState } from './lib/storage.js';
import { addRoute, initRouter, navigate } from './router.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderHome } from './views/home.js';
import { renderReview } from './views/review.js';
import { renderStats } from './views/stats.js';
import { renderSettings } from './views/settings.js';

const app = document.getElementById('app');

addRoute('/onboarding', () => renderOnboarding(app));
addRoute('/home',       () => renderHome(app));
addRoute('/review',     () => renderReview(app));
addRoute('/stats',      () => renderStats(app));
addRoute('/settings',   () => renderSettings(app));

// Determine start route
const state = loadState();
const hasData = state && state.memorizedJuz && state.memorizedJuz.length > 0;
const currentHash = window.location.hash.replace(/^#/, '');

if (!hasData) {
  navigate('/onboarding');
} else if (!currentHash || currentHash === '/') {
  navigate('/home');
}

initRouter();
