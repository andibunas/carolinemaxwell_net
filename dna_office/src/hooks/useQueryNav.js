import { useCallback, useSyncExternalStore } from 'react';

// The hosting environment has no SPA rewrite rule, so there is exactly one
// physical page (index.html) and every "route" is encoded as a query string
// on it -- a refresh or a typed-in link always resolves, because the server
// serves the same file regardless of what's after the `?`.
export const DEFAULT_SECTION = 'home';

function readParams() {
  return new URLSearchParams(window.location.search);
}

// Every call to useQueryNav() (App, SiteHeader, every page...) must see the
// same current params, and re-render together when one of them navigates.
// history.pushState() doesn't fire a `popstate` event -- only back/forward
// does -- so a plain per-component useState can't stay in sync across call
// sites. This module-level store + useSyncExternalStore is the fix: one
// snapshot, one set of subscribers, updated explicitly on every navigation.
let snapshot = readParams();
const listeners = new Set();

function emitChange() {
  snapshot = readParams();
  listeners.forEach((listener) => listener());
}

window.addEventListener('popstate', emitChange);

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function navigateTo(next, { replace = false } = {}) {
  const nextParams = new URLSearchParams(next);
  const qs = nextParams.toString();
  const url = qs ? `?${qs}` : window.location.pathname;
  if (replace) {
    window.history.replaceState(null, '', url);
  } else {
    window.history.pushState(null, '', url);
  }
  emitChange();
}

export function useQueryNav() {
  const params = useSyncExternalStore(subscribe, getSnapshot);

  const navigate = useCallback((next, options) => navigateTo(next, options), []);

  // Build an href for a plain <a> (so open-in-new-tab, middle-click, etc.
  // work) plus an onClick that intercepts a normal left-click into a
  // pushState navigation instead of a full reload.
  const linkTo = useCallback((next) => {
    const nextParams = new URLSearchParams(next);
    const qs = nextParams.toString();
    return {
      href: qs ? `?${qs}` : window.location.pathname,
      onClick: (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigateTo(next);
      },
    };
  }, []);

  const section = params.get('section') || DEFAULT_SECTION;

  return { params, section, navigate, linkTo };
}
