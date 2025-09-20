import { forwardRef, useId } from 'react';
import { classes } from '../utils/style';
import styles from './monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    <svg
      aria-hidden
      className={classes(styles.customShape, className)}
      width="40"
      height="40"
      viewBox="0 0 50 50"
      ref={ref}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <polygon
            transform="matrix(-0.5868455907472016,0,0,0.5868455907472016,55.757374436642294,-4.781031211385791)"
            points="63.581,46.267 73.385,50.78 83,51.625 79.89,54.737 76.184,55.293 77.273,65.25 85.828,71.629 88.321,81.117 94.314,85.435 93.928,86.988 95.012,88.119 92.054,91.853 87.229,84.851 82.409,74.896 63.581,67.581 58.137,62.137 40.987,60.521 37.29,62.445 25.931,63.226 28.034,66.829 32.353,69.215 35.015,69.911 34.569,71.373 36.976,73.029 35.108,76.607 26.555,69.062 20.797,61.516 27.331,56.382 22.842,48.384 21.267,37.123 17.686,36.777 16.016,38.886 18.933,39.166 18.35,41.324 20.33,44.088 14.849,41.908 11.757,45.058 9.89,45.524 8.037,44.711 7.261,36.777 4.988,30.822 6.794,27.753 6.794,20.907 11.305,13.75 19.396,8.147 30.599,8.147 36.655,13.911 37.286,22.462 34.952,15.461 29.665,11.26 21.263,12.661 15.506,17.64 13.481,25.574 19.706,21.062 18.772,24.485 28.684,27.431 42.421,36.31 52.845,43.467"
          />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
    // <svg
    //   aria-hidden
    //   className={classes(styles.monogram, className)}
    //   width="48"
    //   height="29"
    //   viewBox="0 0 48 29"
    //   ref={ref}
    //   {...props}
    // >
    //   <defs>
    //     <clipPath id={clipId}>
    //       <path d="M0 0h6.5a6 6 0 0 1 5.2 3.1L19.4 17l4-9L19 0h6.5a6 6 0 0 1 5.2 3.1L39.5 19 35 29 24.5 10 16 29 0 0Zm46.7 2.8A2 2 0 0 0 45 0h-7l5.5 10 3.2-7.2Z" />
    //     </clipPath>
    //   </defs>
    //   <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
    //   {highlight && (
    //     <g clipPath={`url(#${clipId})`}>
    //       <rect className={styles.highlight} width="100%" height="100%" />
    //     </g>
    //   )}
    // </svg>
  );
});
