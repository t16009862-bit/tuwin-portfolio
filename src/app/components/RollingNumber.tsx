'use client';
import { useEffect, useRef, useState } from 'react';
export default function RollingNumber({ value }: { value: string | number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const text = String(value);
  return <span ref={ref} aria-label={text} style={{ display: 'inline-flex', fontVariantNumeric: 'tabular-nums' }}>
    {[...text].map((digit, index) => {
      if (!/\d/.test(digit)) return <span key={index} aria-hidden="true">{digit}</span>;
      const steps = 30 + index * 10 + Number(digit);
      return <span key={index} aria-hidden="true" style={{ height: '1em', width: '.64em', overflow: 'hidden', display: 'inline-block' }}>
        <span className={active ? 'spin active' : 'spin'} style={{ '--end': `-${steps}em`, '--duration': `${1.2 + index * .2}s` } as React.CSSProperties}>
          {Array.from({ length: steps + 1 }, (_, i) => <span key={i} style={{ height: '1em', lineHeight: '1em', display: 'block', textAlign: 'center' }}>{i % 10}</span>)}
        </span>
      </span>;
    })}
    <style jsx>{`.spin{display:block;transform:translateY(0)}.active{animation:roll var(--duration) cubic-bezier(.13,.78,.18,1) forwards}@keyframes roll{to{transform:translateY(var(--end))}}@media(prefers-reduced-motion:reduce){.active{animation-duration:.01ms}}`}</style>
  </span>;
}
