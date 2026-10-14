'use client';

import { useEffect, useRef, useState } from 'react';

export default function RollingNumber({ value }: { value: string | number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={active ? 'rolling-number rolling-number-active' : 'rolling-number'}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}
    >
      {String(value)}
      <style jsx>{`
        .rolling-number-active {
          animation: number-arrive 650ms cubic-bezier(.2,.75,.25,1) both;
        }
        @keyframes number-arrive {
          from { opacity: .72; transform: translateY(.12em) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rolling-number-active { animation: none; }
        }
      `}</style>
    </span>
  );
}
