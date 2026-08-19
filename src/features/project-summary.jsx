import { Button } from '../components/button';
import { Divider } from '../components/divider';
import { Heading } from '../components/heading';
import { deviceModels } from '../components/model/device-models';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { useTheme } from '../components/theme-provider';
import { Transition } from '../components/transition';
import { Loader } from '../components/loader';
import { TiltImage } from '../components/tilt-image';
import { useWindowSize } from '../hooks';
import { Suspense, lazy, useState } from 'react';
import { cssProps, media } from '../components/utils/style';
import { useHydrated } from '../hooks/useHydrated';
import katakana from './katakana.svg';
import styles from './project-summary.module.css';

const asset = file => `/assets/images/${encodeURIComponent(file)}`;

const sectionGalleries = {
  1: [
    {
      src: asset('baggy1.jpg'),
      alt: 'Modern baggy denim — editorial silhouette',
      caption: 'Editorial · Streetwear',
    },
    {
      src: asset('baggy2.jpg'),
      alt: 'Urban denim styling — full body',
      caption: 'Urban · Silhouette',
    },
  ],
  2: [
    {
      src: asset('Extra Wide Leg Baggy Carpenter Denim Jeans Vintage Inspired Relaxed Workwear Utility Pants With Multiple Pockets Fall Winter Fashion Streetwear.jpg'),
      alt: 'Extra wide-leg carpenter denim jeans',
      caption: 'Wide-Leg · Carpenter',
    },
    {
      src: asset('Deconstructed Washed Jeans.jpg'),
      alt: 'Deconstructed washed denim — signature treatment',
      caption: 'Deconstructed · Washed',
    },
  ],
  3: [
    {
      src: asset('rust-smeared.jpg'),
      alt: 'Rust-smeared signature wash treatment',
      caption: 'Signature Wash · Crafted',
    },
    {
      src: asset('baggy-backpose.jpeg'),
      alt: 'Back-pose detail — manufacturing reference',
      caption: 'Detail · Manufactured in Mumbai',
    },
  ],
};

const Model = lazy(() =>
  import('../components/model').then(module => ({ default: module.Model }))
);

export function ProjectSummary({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  section,
  title,
  descriptionLead,
  description,
  model,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const isHydrated = useHydrated();
  const titleId = `${id}-title`;
  const isMobile = width <= media.tablet;
  const svgOpacity = theme === 'light' ? 0.7 : 1;
  const indexText = index < 10 ? `0${index}` : index;
  const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;
  const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

  function handleModelLoad() {
    setModelLoaded(true);
  }

  function renderKatakana(device, visible) {
    return (
      <svg
        type="project"
        data-visible={visible && modelLoaded}
        data-light={theme === 'light'}
        style={cssProps({ opacity: svgOpacity })}
        className={styles.svg}
        data-device={device}
        viewBox="0 0 751 136"
      >
        <use href={`${katakana}#katakana-project`} />
      </svg>
    );
  }

  function renderHeader(visible) {
    return (
      <header className={styles.header}>
        <div aria-hidden className={styles.index}>
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={!visible}
            collapseDelay={1000}
          />
          <span className={styles.indexNumber} data-visible={visible}>
            <span className={styles.indexLabel}>{section}</span>
          </span>
        </div>
        <Heading
          level={3}
          as="h2"
          className={styles.title}
          data-visible={visible}
          id={titleId}
        >
          {title}
        </Heading>
      </header>
    );
  }

  function renderDescriptionLead(visible) {
    if (!descriptionLead) return null;
    return (
      <Text className={styles.descriptionLead} data-visible={visible} as="div">
        {descriptionLead}
      </Text>
    );
  }

  function renderDescription(visible) {
    return (
      <Text className={styles.description} data-visible={visible} as="div">
        {description}
      </Text>
    );
  }

  function renderGallery(visible) {
    const gallery = sectionGalleries[index] || sectionGalleries[1];
    return (
      <div className={styles.gallery} data-visible={visible}>
        {isHydrated &&
          gallery.map((img, i) => (
            <TiltImage
              key={`${img.src}-${i}`}
              src={img.src}
              alt={img.alt}
              caption={img.caption}
              className={styles.galleryItem}
              style={{ '--itemIndex': i }}
            />
          ))}
      </div>
    );
  }

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div className={styles.content}>
        <Transition in={sectionVisible || focused}>
          {({ visible }) => (
            <>
              {renderHeader(visible)}
              <div className={styles.body}>
                {renderDescriptionLead(visible)}
                {renderGallery(sectionVisible)}
                {renderDescription(visible)}
              </div>
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
}
