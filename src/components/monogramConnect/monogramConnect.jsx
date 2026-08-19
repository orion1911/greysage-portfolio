import { forwardRef, useId } from 'react';
import { classes } from '../utils/style';
import styles from './monogramConnect.module.css';

/**
 * Navbar mark for the /connect page. Monochrome and theme-aware, unlike the
 * multicolour Gmail mark it sits beneath — this one is a Greysage glyph, not a
 * third-party logo. Uses the same clip-path + accent-sweep hover as Monogram.
 */
export const MonogramConnect = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-connect-clip`;

  return (
    <svg
      aria-hidden
      className={classes(styles.monogramConnect, className)}
      width="40"
      height="40"
      viewBox="0 0 100 100"
      ref={ref}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          {/* Contact card outline */}
          <path
            fillRule="evenodd"
            d="M10 22h80a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6Zm2 8v40h76V30H12Z"
          />
          {/* Portrait: head and shoulders */}
          <circle cx="36" cy="45" r="9" />
          <path d="M22 65a14 14 0 0 1 28 0v2H22v-2Z" />
          {/* Detail lines */}
          <rect x="60" y="41" width="24" height="5" rx="2.5" />
          <rect x="60" y="53" width="24" height="5" rx="2.5" />
          <rect x="60" y="65" width="15" height="5" rx="2.5" />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});
