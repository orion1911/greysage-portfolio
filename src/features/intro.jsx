import { DecoderText } from '../components/decoder-text';
import { Heading } from '../components/heading';
import { Section } from '../components/section';
import { useTheme } from '../components/theme-provider';
import { tokens } from '../components/theme-provider/theme';
import { Transition } from '../components/transition';
import { VisuallyHidden } from '../components/visually-hidden';
import { Link as RouterLink } from 'react-router-dom';
import { useInterval, usePrevious, useScrollToHash } from '../hooks';
import { Fragment, Suspense, lazy, useEffect, useState, useRef } from 'react';
import { cssProps } from '../components/utils/style';
import config from '../config.json';
import { useHydrated } from '../hooks/useHydrated';
import styles from './intro.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import Sphere3D from './sphere3D';

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }) {
  const { theme } = useTheme();
  const { disciplines } = config;

  // Simplified state management - single source of truth
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const prevTheme = usePrevious(theme);
  const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
    ', and '
  );
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();
  const isHydrated = useHydrated();

  useInterval(
    () => {
      setCurrentIndex(prev => (prev + 1) % disciplines.length);
      // Force animation restart by changing key
      setAnimationKey(prev => prev + 1);
    },
    5000,
    theme
  );

  useEffect(() => {
    if (prevTheme && prevTheme !== theme) {
      setCurrentIndex(0);
    }
  }, [theme, prevTheme]);

  const handleScrollClick = event => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme} timeout={3000}>
        {({ visible, status }) => (
          <>
            {isHydrated && (
              <Suspense>
                <Sphere3D />
              </Suspense>
            )}
            <header className={styles.text}>
              <h1 className={styles.name} data-visible={visible} id={titleId}>
                <DecoderText text={config.proprietary + "'s"} delay={500} />
              </h1>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>
                  {`${config.role} + ${introLabel}`}
                </VisuallyHidden>
                <span aria-hidden className={styles.row}>
                  <span
                    className={styles.word}
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    {config.role}
                  </span>
                  <span className={styles.line} data-status={status} />
                </span>
                <div className={styles.row}>
                  <div className={styles.disciplineContainer}>
                    <span
                      key={animationKey}
                      className={`${styles.word}  ${styles.discipline}`}
                      data-plus={true}
                      data-status="animate"
                      style={cssProps({ delay: tokens.base.durationL })}
                    >
                      {disciplines[currentIndex]}
                    </span>
                  </div>
                </div>
              </Heading>
            </header>
            <RouterLink
              to="/#section-1"
              className={styles.scrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll</VisuallyHidden>
            </RouterLink>
            <RouterLink
              to="/#section-1"
              className={styles.mobileScrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll</VisuallyHidden>
              <svg
                aria-hidden
                stroke="currentColor"
                width="43"
                height="15"
                viewBox="0 0 43 15"
              >
                <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
              </svg>
            </RouterLink>
          </>
        )}
      </Transition>
    </Section>
  );
}