import { DecoderText } from '../components/decoder-text';
import { Heading } from '../components/heading';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Transition } from '../components/transition';
import { Fragment, useState } from 'react';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={4} id={titleId}>
      <DecoderText text="Why Partner with GREYSAGE?" start={visible} delay={500} />
    </Heading>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      If your brand targets the energetic, trend-driven youth market, GREYSAGE is your ideal manufacturing ally. Since our inception in 2019
       as Allyz Jeans, we've honed our craft to deliver apparel that drives engagement and loyalty among young customers. 
       We don't just produce clothing—we craft cultural statements.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
      // style={{ marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0, minHeight: '58vh' }}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef} style={{ gridTemplateColumns: 'auto', minHeight: '50vh !important'}}>
            <div className={styles.column} style={{ marginBottom: 0 }}>
              <ProfileText visible={visible} titleId={titleId} />
              {/* <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href="/contact"
                icon="send"
              >
                Send us a message
              </Button> */}
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
