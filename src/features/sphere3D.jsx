// src/components/Sphere3D.js
import React, { useEffect, useRef } from 'react';
import { Transition } from '../components/transition';
import { DisplacementSphere } from '../sphere3d';
import styles from './sphere3D.module.css';

const Sphere3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sphere = new DisplacementSphere(containerRef.current);
    return () => {
      sphere.destroy();
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