import { useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Native scrollIntoView({ behavior: 'smooth' }) hands the duration to the
 * browser (~500ms in Chrome, longer in Firefox) and it sped up perceptibly
 * once the sphere stopped janking the main thread. Animating with rAF instead
 * pins the pacing so it feels identical everywhere, every time.
 */
const SCROLL_DURATION = 1100; // ms — tune the glide here
// Same family as --bezierFastoutSlowin: fast start, long settle.
const easeOutQuint = t => 1 - Math.pow(1 - t, 5);

export function useScrollToHash() {
  const frame = useRef();
  const cleanupRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => () => cleanupRef.current?.(), []);

  const scrollToHash = useCallback(
    (hash, onDone) => {
      const id = hash.split('#')[1];
      const targetElement = document.getElementById(id);
      if (!targetElement) return;

      cleanupRef.current?.();

      const finish = () => {
        cleanupRef.current?.();
        if (window.location.pathname === location.pathname) {
          onDone?.();
          navigate(`${location.pathname}#${id}`, { scroll: false });
        }
      };

      if (reduceMotion) {
        targetElement.scrollIntoView({ behavior: 'auto' });
        finish();
        return;
      }

      const startY = window.scrollY;
      const targetY =
        startY + targetElement.getBoundingClientRect().top;
      const startTime = performance.now();

      // Hand control back the moment the user scrolls themselves.
      const cancel = () => cleanupRef.current?.();
      window.addEventListener('wheel', cancel, { passive: true });
      window.addEventListener('touchstart', cancel, { passive: true });

      cleanupRef.current = () => {
        cancelAnimationFrame(frame.current);
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
        cleanupRef.current = undefined;
      };

      const step = now => {
        const t = Math.min((now - startTime) / SCROLL_DURATION, 1);
        window.scrollTo(0, startY + (targetY - startY) * easeOutQuint(t));
        if (t < 1) {
          frame.current = requestAnimationFrame(step);
        } else {
          finish();
        }
      };

      frame.current = requestAnimationFrame(step);
      return () => cleanupRef.current?.();
    },
    [navigate, reduceMotion, location.pathname]
  );

  return scrollToHash;
}
