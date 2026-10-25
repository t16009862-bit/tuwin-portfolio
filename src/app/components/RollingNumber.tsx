'use client';

import { useEffect, useRef, useState } from 'react';

const ROLL_DURATION_MS = 950;
const FRAME_INTERVAL_MS = 55;

function scrambleDigits(value: string, progress: number) {
  const digitCount = [...value].filter((character) => /\d/.test(character)).length;
  const lockedDigits = Math.floor(progress * digitCount);
  let digitIndex = 0;

  return [...value].map((character) => {
    if (!/\d/.test(character)) return character;

    const output = digitIndex < lockedDigits
      ? character
      : String(Math.floor(Math.random() * 10));
    digitIndex += 1;
    return output;
  }).join('');
}

export default function RollingNumber({ value }: { value: string | number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalValue = String(value);
  const [displayValue, setDisplayValue] = useState(finalValue);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setDisplayValue(finalValue);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let animationFrame = 0;
    let lastFrame = 0;
    let isVisible = false;

    const startRoll = () => {
      cancelAnimationFrame(animationFrame);
      const startedAt = performance.now();
      lastFrame = 0;
      setRolling(true);

      const animate = (now: number) => {
        const elapsed = now - startedAt;
        const progress = Math.min(elapsed / ROLL_DURATION_MS, 1);

        if (now - lastFrame >= FRAME_INTERVAL_MS || progress === 1) {
          setDisplayValue(progress === 1 ? finalValue : scrambleDigits(finalValue, progress));
          lastFrame = now;
        }

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setRolling(false);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        startRoll();
      } else if (!entry.isIntersecting && isVisible) {
        isVisible = false;
        cancelAnimationFrame(animationFrame);
        setRolling(false);
        setDisplayValue(finalValue);
      }
    }, {
      threshold: 0.6,
      rootMargin: '-12% 0px -12% 0px',
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [finalValue]);

  return (
    <span
      ref={ref}
      className={rolling ? 'rolling-number rolling-number-active' : 'rolling-number'}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}
      aria-label={finalValue}
    >
      <span aria-hidden="true">{displayValue}</span>
      <style jsx>{`
        .rolling-number-active {
          animation: number-roll 180ms ease-in-out infinite alternate;
        }
        @keyframes number-roll {
          from { opacity: .76; transform: translateY(.08em); filter: blur(.3px); }
          to { opacity: 1; transform: translateY(-.03em); filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rolling-number-active { animation: none; }
        }
      `}</style>
    </span>
  );
}
