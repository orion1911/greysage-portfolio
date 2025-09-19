import { Button } from '../components/button';
import { DecoderText } from '../components/decoder-text';
import { Divider } from '../components/divider';
import { Footer } from '../components/footer';
import { Heading } from '../components/heading';
import { Icon } from '../components/icon';
import { Input } from '../components/input';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { tokens } from '../components/theme-provider/theme';
import { Transition } from '../components/transition';
import { useFormInput } from '../hooks';
import { useRef, useState } from 'react';
import { cssProps, msToNum, numToMs } from '../components/utils/style';
import styles from './contact.module.css';

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const EMAIL_PATTERN = /(.+)@(.+){2,}\.(.+){2,}/;

export const Contact = () => {
  const errorRef = useRef();
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const [formState, setFormState] = useState({
    isSubmitting: false,
    errors: null,
    success: false,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormState({ isSubmitting: true, errors: null, success: false });

    const formData = new FormData(event.target);
    const isBot = formData.get('name'); // Honeypot field
    const emailValue = formData.get('email');
    const messageValue = formData.get('message');
    const errors = {};

    // Client-side validation
    if (isBot) {
      setFormState({ isSubmitting: false, errors: null, success: true });
      return;
    }

    if (!emailValue || !EMAIL_PATTERN.test(emailValue)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!messageValue) {
      errors.message = 'Please enter a message.';
    }

    if (emailValue.length > MAX_EMAIL_LENGTH) {
      errors.email = `Email address must be shorter than ${MAX_EMAIL_LENGTH} characters.`;
    }

    if (messageValue.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Message must be shorter than ${MAX_MESSAGE_LENGTH} characters.`;
    }

    if (Object.keys(errors).length > 0) {
      setFormState({ isSubmitting: false, errors, success: false });
      return;
    }

    try {

      const response = await fetch(process.env.REACT_APP_API_URL + '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailValue,
          message: messageValue,
        }),
      });

      if (response.ok) {
        setFormState({ isSubmitting: false, errors: null, success: true });
      } else {
        setFormState({
          isSubmitting: false,
          errors: response.error || { general: 'Failed to send message.' },
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      setFormState({
        isSubmitting: false,
        errors: { general: 'An error occurred. Please try again later.' },
        success: false,
      });
    }
  };

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!formState.success} timeout={1600}>
        {({ status, nodeRef }) => (
          <form
            className={styles.form}
            method="post"
            ref={nodeRef}
            onSubmit={handleSubmit}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            {/* Hidden honeypot field to identify bots */}
            <Input
              className={styles.botkiller}
              label="Name"
              name="name"
              maxLength={MAX_EMAIL_LENGTH}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your email"
              type="email"
              name="email"
              maxLength={MAX_EMAIL_LENGTH}
              {...email}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />
            <Transition
              unmount
              in={!formState.isSubmitting && formState.errors}
              timeout={msToNum(tokens.base.durationM)}
            >
              {({ status: errorStatus, nodeRef }) => (
                <div
                  className={styles.formError}
                  ref={nodeRef}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? errorRef.current?.offsetHeight : 0,
                  })}
                >
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {formState.errors?.email}
                      {formState.errors?.message}
                      {formState.errors?.general}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <Button
              className={styles.button}
              data-status={status}
              data-sending={formState.isSubmitting}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={formState.isSubmitting}
              loading={formState.isSubmitting}
              loadingText="Sending..."
              icon="send"
              type="submit"
            >
              Send message
            </Button>
          </form>
        )}
      </Transition>
      <Transition unmount in={formState.success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading
              level={3}
              as="h3"
              className={styles.completeTitle}
              data-status={status}
            >
              Message Sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              I’ll get back to you within a couple days, sit tight
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}