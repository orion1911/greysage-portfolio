// src/components/Sphere3D.js
import React, { useEffect, useRef } from 'react';
import { Transition } from '../components/transition';
import { DisplacementSphere } from '../sphere3d';
import styles from './sphere3D.module.css';

const Sphere3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let sphere;
    let cancelled = false;

    const start = () => {
      if (cancelled || !containerRef.current) return;

      // If WebGL is unavailable or the context limit is hit, three.js throws
      // from the constructor. Uncaught, that propagates out of the effect and
      // React unmounts the whole tree — a blank, unclickable page.
      try {
        sphere = new DisplacementSphere(containerRef.current);
      } catch (error) {
        console.warn('Sphere background unavailable:', error);
      }
    };

    // Building the geometry blocks the main thread for a noticeable stretch.
    // Run it during idle time so it can't stall the page's entrance
    // animations — done synchronously, it eats them entirely: every element
    // jumps straight to its final state instead of easing in.
    const idle = typeof window.requestIdleCallback === 'function';
    const handle = idle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : setTimeout(start, 900);

    return () => {
      cancelled = true;

      if (idle) {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }

      if (!sphere) return;

      try {
        sphere.destroy();
      } catch (error) {
        console.warn('Sphere teardown failed:', error);
      }
    };
  }, []);

  // return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
  return (
      <Transition in timeout={3000} nodeRef={containerRef}>
        {({ visible, nodeRef }) => (
          <div
            aria-hidden
            className={styles.canvas}
            data-visible={visible}
            ref={nodeRef}
            // {...props}
          />
        )}
      </Transition>
    );
};

export default Sphere3D;