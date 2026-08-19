import { Text } from '../text';
import { classes } from '../utils/style';
import config from '../../config.json';
import styles from './footer.module.css';

export const Footer = ({ className }) => (
  <footer className={classes(styles.footer, className)}>
    <div className={styles.inner}>
      <Text size="s" className={styles.brand}>
        <span className={styles.mark}>{config.role}</span>
        <span className={styles.separator} aria-hidden>·</span>
        <span className={styles.tagline}>Mumbai · Est. 2015</span>
      </Text>
      <Text size="s" className={styles.copy}>
        {`© ${new Date().getFullYear()} ${config.role}. All rights reserved.`}
      </Text>
    </div>
  </footer>
);
