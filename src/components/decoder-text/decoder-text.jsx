import { VisuallyHidden } from '../visually-hidden/visually-hidden';
import { useReducedMotion, useSpring } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { delay } from '../utils/delay';
import { classes } from '../utils/style';
import styles from './decoder-text.module.css';

// prettier-ignore
const glyphs = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ', 'ー',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン',
  'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
  'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
  'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
  'バ', 'ビ', 'ブ', 'ベ', 'ボ',
  'パ', 'ピ', 'プ', 'ペ', 'ポ',
];

const CharType = {
  Glyph: 'glyph',
  Value: 'value',
};

function shuffle(content, output, position) {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length);
      return { type: CharType.Glyph, value: glyphs[rand] };
    }

    // output starts life as a single-element array, so on the first spring tick
    // every index past 0 is undefined. Reading .value off it threw
    // "Cannot read properties of undefined" and, in dev, put the runtime error
    // overlay over the page — most visibly right after a route change, which
    // remounts every DecoderText at once.
    const previous = output[index];

    if (previous) {
      return { type: CharType.Glyph, value: previous.value };
    }

    return {
      type: CharType.Glyph,
      value: glyphs[Math.floor(Math.random() * glyphs.length)],
    };
  });
}

export const DecoderText = memo(
  ({ text, start = true, delay: startDelay = 0, className, ...rest }) => {
    const output = useRef([{ type: CharType.Glyph, value: '' }]);
    const container = useRef();
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      const content = text.split('');
      let animation;

      const renderOutput = () => {
        const characterMap = output.current.map(item => {
          return `<span class="${styles[item.type]}">${item.value}</span>`;
        });

        containerInstance.innerHTML = characterMap.join('');
      };

      const unsubscribeSpring = decoderSpring.on('change', value => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = async () => {
        await delay(startDelay);
        decoderSpring.set(content.length);
      };

      if (start && !animation && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map((value, index) => ({
          type: CharType.Value,
          value: content[index],
        }));
        renderOutput();
      }

      return () => {
        unsubscribeSpring?.();
      };
    }, [decoderSpring, reduceMotion, start, startDelay, text]);

    return (
      <span className={classes(styles.text, className)} {...rest}>
        <VisuallyHidden className={styles.label}>{text}</VisuallyHidden>
        {/* Reserves exactly the width of the resolved text. The animated copy is
            laid over it, so the much wider scrambled string never influences
            layout. */}
        <span aria-hidden className={styles.sizer}>
          {text}
        </span>
        <span aria-hidden className={styles.content} ref={container} />
      </span>
    );
  }
);
