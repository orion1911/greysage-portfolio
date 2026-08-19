import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Starts every route at the top.
 *
 * Two separate problems this solves:
 *
 * 1. Refresh. Browsers restore the previous scroll offset on reload, so
 *    refreshing halfway down a page drops you back halfway down. Setting
 *    scrollRestoration to 'manual' hands that decision to us instead.
 *
 * 2. Navigation. Home reveals its sections with an IntersectionObserver. Coming
 *    back from a scrolled page leaves those sections already intersecting, so
 *    they render fully visible and the entrance animation never plays. Resetting
 *    in useLayoutEffect — before paint, and before the observer measures — means
 *    they start off-screen and animate in properly.
 *
 * Hash links are left alone so useScrollToHash keeps working.
 */
export function useScrollRestore() {
  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) return;

    // behavior: 'auto' overrides any scroll-behavior: smooth, which would
    // otherwise animate the jump and let the observer fire on the way up.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash, key]);
}
