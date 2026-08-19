import { useRef, useState, useCallback } from 'react';
import { classes } from '../utils/style';
import styles from './tilt-image.module.css';

export const TiltImage = ({
  src,
  alt,
  caption,
  className,
  maxTilt = 8,
  scale = 1.02,
  ...rest
}) => {
  const innerRef = useRef(null);
  const [transform, setTransform] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  const handlePointerMove = useCallback(
    event => {
      if (event.pointerType !== 'mouse') return;
      const node = innerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;
      const ry = (px - 0.5) * 2 * maxTilt;
      const rx = -(py - 0.5) * 2 * maxTilt;
      setTransform({ rx, ry, mx: px * 100, my: py * 100, active: true });
    },
    [maxTilt]
  );

  const handlePointerLeave = useCallback(() => {
    setTransform({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  }, []);

  return (
    <figure
      className={classes(styles.frame, className)}
      data-active={transform.active}
      style={{
        '--rx': `${transform.rx}deg`,
        '--ry': `${transform.ry}deg`,
        '--mx': `${transform.mx}%`,
        '--my': `${transform.my}%`,
        '--scale': transform.active ? scale : 1,
      }}
      {...rest}
    >
      <div
        ref={innerRef}
        className={styles.inner}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <img className={styles.image} src={src} alt={alt} loading="lazy" />
        <span className={styles.gloss} aria-hidden />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
};
