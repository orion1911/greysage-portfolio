import { forwardRef, useId } from 'react';
import { classes } from '../utils/style';
import styles from './monogramContact.module.css';

export const MonogramContact = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipIds = {
    combined: `${id}monogram-clip-combined`,
    st0: `${id}monogram-clip-st0`,
    st1: `${id}monogram-clip-st1`,
    st2: `${id}monogram-clip-st2`,
    st3: `${id}monogram-clip-st3`,
    st4: `${id}monogram-clip-st4`,
  };

  return (
    <svg
      aria-hidden
      className={classes(styles.monogramContact, className)}
      width="40"
      height="40"
      viewBox="-12 0 150 100"
      ref={ref}
      {...props}
    >
      <style type="text/css">
        {`
          .st0 { fill: #d91d0cff; }
          .st1 { fill: #12b5ecff; }
          .st2 { fill: #cec924ff; }
          .st3 { fill: #7d81e4ff; }
          .st4 { fill: #88d10bff; }
          .highlight { fill: oklch(84.42% 0.19 202.24); opacity: 0.7; stroke: #000000; stroke-width: 2; }
        `}
      </style>
      <defs>
        <clipPath id={clipIds.combined}>
          <path className="st4" d="M8.36,92.12h19.54V44.67L0,23.76v60.08C0,88.42,3.78,92.12,8.36,92.12L8.36,92.12z" />
          <path className="st3" d="M94.97,92.12h19.54c4.67,0,8.36-3.78,8.36-8.36v-60L94.97,44.67V92.12L94.97,92.12z" />
          <path className="st2" d="M94.97,8.4v36.27l27.91-20.91V12.58c0-10.37-11.82-16.25-20.11-10.05L94.97,8.4L94.97,8.4z" />
          <polygon className="st0" points="27.9,44.67 27.9,8.4 61.44,33.57 94.97,8.4 94.97,44.67 61.44,69.76 27.9,44.67" />
          <path className="st1" d="M0,12.58v11.18l27.91,20.91V8.4l-7.8-5.87C11.82-3.66,0,2.29,0,12.58L0,12.58z" />
        </clipPath>
        <clipPath id={clipIds.st0}>
          <polygon className="st0" points="27.9,44.67 27.9,8.4 61.44,33.57 94.97,8.4 94.97,44.67 61.44,69.76 27.9,44.67" />
        </clipPath>
        <clipPath id={clipIds.st1}>
          <path className="st1" d="M0,12.58v11.18l27.91,20.91V8.4l-7.8-5.87C11.82-3.66,0,2.29,0,12.58L0,12.58z" />
        </clipPath>
        <clipPath id={clipIds.st2}>
          <path className="st2" d="M94.97,8.4v36.27l27.91-20.91V12.58c0-10.37-11.82-16.25-20.11-10.05L94.97,8.4L94.97,8.4z" />
        </clipPath>
        <clipPath id={clipIds.st3}>
          <path className="st3" d="M94.97,92.12h19.54c4.67,0,8.36-3.78,8.36-8.36v-60L94.97,44.67V92.12L94.97,92.12z" />
        </clipPath>
        <clipPath id={clipIds.st4}>
          <path className="st4" d="M8.36,92.12h19.54V44.67L0,23.76v60.08C0,88.42,3.78,92.12,8.36,92.12L8.36,92.12z" />
        </clipPath>
      </defs>
      <rect className="st0" clipPath={`url(#${clipIds.st0})`} width="100%" height="100%" />
      <rect className="st1" clipPath={`url(#${clipIds.st1})`} width="100%" height="100%" />
      <rect className="st2" clipPath={`url(#${clipIds.st2})`} width="100%" height="100%" />
      <rect className="st3" clipPath={`url(#${clipIds.st3})`} width="100%" height="100%" />
      <rect className="st4" clipPath={`url(#${clipIds.st4})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipIds.combined})`}>
          <rect className={classes(styles.highlight, 'highlight')} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});