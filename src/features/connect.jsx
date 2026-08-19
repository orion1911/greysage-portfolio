import { useRef, useState } from 'react';
import { Button } from '../components/button';
import { DecoderText } from '../components/decoder-text';
import { Divider } from '../components/divider';
import { Heading } from '../components/heading';
import { Icon } from '../components/icon';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { tokens } from '../components/theme-provider/theme';
import { Transition } from '../components/transition';
import { cssProps, msToNum, numToMs } from '../components/utils/style';
import { channels, contactDetails } from './connect-data';
import config from '../config.json';
import styles from './connect.module.css';

export const Connect = () => {
  const initDelay = tokens.base.durationS;
  const [copied, setCopied] = useState(null);
  const copyTimer = useRef();

  const getDelay = (delayMs, offset = numToMs(0), multiplier = 1) => {
    const numDelay = msToNum(delayMs) * multiplier;
    return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
  };

  const flash = message => {
    setCopied(message);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 2400);
  };

  const handleCopy = async (event, value, label) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement('textarea');
        field.value = value;
        field.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        document.body.removeChild(field);
      }
      flash(`${label} copied`);
    } catch (error) {
      flash('Press and hold to copy');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: config.name, url: window.location.href });
        return;
      } catch (error) {
        return; // dismissed
      }
    }
    handleCopy({ preventDefault() {}, stopPropagation() {} }, window.location.href, 'Link');
  };

  // iOS ignores the download attribute; letting Safari navigate to the .vcf
  // opens its "Add Contact" sheet instead of a dead tab.
  const isIOS =
    typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent);

  /**
   * Button turns any non-"://" href into a react-router <Link>, which would make
   * the SPA router swallow the click and never serve the file. So trigger the
   * download from a detached anchor instead of handing Button an href.
   */
  const handleSaveContact = () => {
    const anchor = document.createElement('a');
    anchor.href = contactDetails.vcard;
    if (!isIOS) anchor.download = 'Greysage.vcf';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    flash('Opening contact card');
  };

  return (
    <Section className={styles.connect}>
      <Transition in timeout={1600}>
        {({ status, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Connect" start={status !== 'exited'} delay={300} />
            </Heading>

            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />

            <Text
              className={styles.intro}
              data-status={status}
              size="l"
              as="p"
              style={getDelay(tokens.base.durationXS, initDelay)}
            >
              {config.name} is run by {contactDetails.proprietor}. Save the contact
              card, or reach us on whichever channel suits you.
            </Text>

            <div
              className={styles.actions}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
            >
              <Button
                className={styles.saveButton}
                icon="save-contact"
                onClick={handleSaveContact}
              >
                Save to contacts
              </Button>
              <Button
                secondary
                className={styles.shareButton}
                icon="link"
                onClick={handleShare}
              >
                Share this page
              </Button>
            </div>

            <ul className={styles.channels}>
              {channels.map(({ id, icon, label, value, href, external, copy }, index) => (
                <li
                  key={id}
                  className={styles.channelItem}
                  data-status={status}
                  style={getDelay(tokens.base.durationM, initDelay, index * 0.4 + 1)}
                >
                  <a
                    className={styles.channel}
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <Icon className={styles.channelIcon} icon={icon} />
                    <span className={styles.channelText}>
                      <span className={styles.channelLabel}>{label}</span>
                      <span className={styles.channelValue}>{value}</span>
                    </span>
                    <Icon
                      className={styles.channelArrow}
                      icon={external ? 'arrow-right' : 'chevron-right'}
                    />
                  </a>
                  {copy && (
                    <button
                      type="button"
                      className={styles.copyButton}
                      aria-label={`Copy ${label.toLowerCase()}`}
                      onClick={event => handleCopy(event, copy, label)}
                    >
                      <Icon icon="copy" size={20} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Transition>

      <Transition unmount in={!!copied} timeout={msToNum(tokens.base.durationM)}>
        {({ status, nodeRef }) => (
          <div className={styles.toast} data-status={status} ref={nodeRef} role="status">
            <Icon icon="check" size={18} />
            {copied}
          </div>
        )}
      </Transition>
    </Section>
  );
};

export default Connect;
