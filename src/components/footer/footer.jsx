import { Text } from '../text';
import { classes } from '../utils/style';
import config from '../../config.json';
import styles from './footer.module.css';

export const Footer = ({ className }) => (
  <footer className={classes(styles.footer, className)} style={{ marginTop: 0, paddingTop: 0 }}>
    <Text size="s" align="center">
      <span className={styles.date}>
        {`© ${new Date().getFullYear()} ${config.role}`}
      </span>
    </Text>
  </footer>
);
