/** Simple hash-based SPA router. */

const routes = new Map();

export function addRoute(hash, handler) {
  routes.set(hash, handler);
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function initRouter() {
  const dispatch = () => {
    const hash = window.location.hash.replace(/^#/, '') || '/home';
    const handler = routes.get(hash);
    if (handler) {
      handler();
    } else {
      // Unknown route — go home
      navigate('/home');
    }
  };

  window.addEventListener('hashchange', dispatch);
  dispatch(); // handle initial URL
}
