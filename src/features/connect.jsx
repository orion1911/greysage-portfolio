import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '../components/button';
import { DecoderText } from '../components/decoder-text';
import { Footer } from '../components/footer';
import { Heading } from '../components/heading';
import { Icon } from '../components/icon';
import { Monogram } from '../components/monogram';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { tokens } from '../components/theme-provider/theme';
import { Transition } from '../components/transition';
import { cssProps, msToNum, numToMs } from '../components/utils/style';
import { cards, contactDetails, profile, socials } from './connect-data';
import { qrOptions } from './qr-logo';
import styles from './connect.module.css';

const QR_DISPLAY_SIZE = 168;
const QR_DOWNLOAD_SIZE = 1024;

export const Connect = () => {
  const initDelay = tokens.base.durationS;
  const [copied, setCopied] = useState(null);
  const [pageUrl, setPageUrl] = useState('');
  const copyTimer = useRef();
  const qrRef = useRef();
  const qrInstance = useRef();

  useEffect(() => {
    setPageUrl(window.location.href);
    return () => clearTimeout(copyTimer.current);
  }, []);

  // qr-code-styling renders into a node imperatively rather than as a
  // component, so mount it once pageUrl exists and tear down on change.
  useEffect(() => {
    if (!pageUrl || !qrRef.current) return;
    // `type: 'svg'` keeps the on-screen code vector-crisp, like QRCodeSVG did.
    qrInstance.current = new QRCodeStyling({
      ...qrOptions(pageUrl, QR_DISPLAY_SIZE),
      type: 'svg',
    });
    qrInstance.current.append(qrRef.current);
    const node = qrRef.current;
    return () => {
      node.replaceChildren();
      qrInstance.current = null;
    };
  }, [pageUrl]);

  const flash = message => {
    setCopied(message);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 2400);
  };

  const saveBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    // Revoke on the next tick — Safari cancels the download if the URL dies first.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyText = async (value, label) => {
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
        await navigator.share({ title: profile.name, url: window.location.href });
        return;
      } catch (error) {
        return; // dismissed
      }
    }
    copyText(window.location.href, 'Link');
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

  /**
   * Export renders a throwaway hi-res instance; the on-screen SVG stays 168px.
   * getRawData + saveBlob (rather than .download()) keeps the Safari-safe
   * object-URL flow we already use for the vCard.
   */
  const handleDownloadPng = async () => {
    if (!pageUrl) return;
    try {
      const hiRes = new QRCodeStyling(qrOptions(pageUrl, QR_DOWNLOAD_SIZE));
      const blob = await hiRes.getRawData('png');
      if (!blob) throw new Error('empty');
      saveBlob(blob, 'greysage-connect-qr.png');
      flash('QR downloaded');
    } catch (error) {
      flash('Could not build the PNG');
    }
  };

  const getDelay = (delayMs, offset = numToMs(0), multiplier = 1) => {
    const numDelay = msToNum(delayMs) * multiplier;
    return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
  };

  const renderCard = (card, status, index) => {
    const { id, kind, icon, label, caption, href, internal, copy } = card;
    const style = getDelay(tokens.base.durationM, initDelay, index * 0.3 + 1);

    if (kind === 'vcard') {
      return (
        <li key={id} className={styles.cardItem} data-status={status} style={style}>
          <button type="button" className={styles.card} onClick={handleSaveContact}>
            <span className={styles.cardIcon}>
              <Icon icon={icon} />
            </span>
            <span className={styles.cardText}>
              <span className={styles.cardLabel}>{label}</span>
              <span className={styles.cardCaption}>{caption}</span>
            </span>
            <Icon className={styles.cardEnd} icon="save-contact" />
          </button>
        </li>
      );
    }

    if (kind === 'featured') {
      return (
        <li key={id} className={styles.cardItem} data-status={status} style={style}>
          <RouterLink to={href} className={`${styles.card} ${styles.featured}`}>
            <span className={styles.banner}>
              <img src={contactDetails.banner} alt="" loading="lazy" />
              <span className={styles.bannerMark}>
                <span className={styles.bannerName}>{profile.name}</span>
                <span className={styles.bannerRule} aria-hidden />
                <span className={styles.bannerTag}>{profile.tagline}</span>
              </span>
            </span>
            <span className={styles.featuredLabel}>
              {label}
              <Icon icon="chevron-right" />
            </span>
          </RouterLink>
        </li>
      );
    }

    const external = href.startsWith('http');
    // Internal routes go through RouterLink; a plain anchor would trigger a
    // full page reload and drop the SPA transition.
    const Component = internal ? RouterLink : 'a';
    const linkProps = internal
      ? { to: href }
      : { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) };

    return (
      <li key={id} className={styles.cardItem} data-status={status} style={style}>
        <Component className={styles.card} {...linkProps}>
          <span className={styles.cardIcon}>
            <Icon icon={icon} />
          </span>
          <span className={styles.cardText}>
            <span className={styles.cardLabel}>{label}</span>
            <span className={styles.cardCaption}>{caption}</span>
          </span>
          {!copy && (
            <Icon
              className={styles.cardEnd}
              icon={external ? 'arrow-right' : 'chevron-right'}
            />
          )}
        </Component>
        {copy && (
          <button
            type="button"
            className={styles.copyButton}
            aria-label={`Copy ${label.toLowerCase()}`}
            onClick={() => copyText(copy, label)}
          >
            <Icon icon="copy" size={20} />
          </button>
        )}
      </li>
    );
  };

  return (
    <>
      <Section className={styles.connect}>
      {/* Timeout must outlast the longest reveal: the last item's delay is
          1700ms and durationXL is 800ms, so 2500ms of animation. At the old
          1600ms the status flipped to `entered` mid-flight, which resets
          transition-delay to 0 and snapped everything into place — no visible
          animation below the divider. */}
      <Transition in timeout={2600}>
        {({ status, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.profile}>
              <span
                className={styles.avatar}
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay, 0.2)}
              >
                <Monogram highlight />
              </span>

              <Heading
                className={styles.title}
                data-status={status}
                level={2}
                as="h1"
                style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
              >
                <DecoderText text={profile.name} start={status !== 'exited'} delay={300} />
              </Heading>

              <Text
                className={styles.tagline}
                data-status={status}
                as="p"
                style={getDelay(tokens.base.durationXS, initDelay, 0.5)}
              >
                {profile.tagline}
              </Text>

              <div
                className={styles.socials}
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay, 0.7)}
              >
                {socials.map(({ id, icon, label, href, internal }) =>
                  internal ? (
                    <RouterLink
                      key={id}
                      to={href}
                      className={styles.social}
                      data-icon={icon}
                      aria-label={label}
                      title={label}
                    >
                      <Icon icon={icon} />
                    </RouterLink>
                  ) : (
                    <a
                      key={id}
                      className={styles.social}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-icon={icon}
                      aria-label={label}
                      title={label}
                    >
                      <Icon icon={icon} />
                    </a>
                  )
                )}
              </div>
            </div>

            <ul className={styles.cards}>
              {cards.map((card, index) => renderCard(card, status, index))}
            </ul>

            <div
              className={styles.qr}
              data-status={status}
              style={getDelay(tokens.base.durationM, initDelay, cards.length * 0.3 + 1)}
            >
              <div className={styles.qrTile}>
                <div ref={qrRef} className={styles.qrMount} />
              </div>
              <div className={styles.qrBody}>
                <span className={styles.qrLabel}>Save or share this code</span>
                {/* <Text className={styles.qrText} size="s" as="p">
                  Points to this page. Print it on tags, labels and cards.
                </Text> */}
                <div className={styles.qrActions}>
                  <Button
                    className={styles.qrButton}
                    icon="download"
                    onClick={handleDownloadPng}
                  >
                    Download PNG
                  </Button>
                  <Button className={styles.qrButton} icon="link" onClick={handleShare}>
                    Share
                  </Button>
                </div>
              </div>
            </div>
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
      {/* Outside the Section on purpose: .section applies a large asymmetric
          padding, and the footer needs to sit full-bleed and identical to the
          home page. home.jsx renders it as a sibling for the same reason. */}
      <Footer />
    </>
  );
};

export default Connect;
