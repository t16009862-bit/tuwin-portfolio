'use client';

import { useState } from 'react';
import Image from 'next/image';

type Sponsor = {
  name: string;
  imageUrl: string;
};

export default function SponsorMarquee({
  sponsors,
  className,
  large = false,
}: {
  sponsors: Sponsor[];
  className: string;
  large?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const viewportClass = playing ? '' : ' sponsor-marquee-manual';
  const trackClass = playing ? ' sponsor-marquee-playing' : '';
  const trackSize = large ? 'sponsor-marquee-large' : 'opacity-75';
  const logoSize = large ? 'h-24 w-48' : 'h-16 w-36';

  return (
    <>
      <div className={className + viewportClass}>
        <div className={`sponsor-marquee flex w-max items-center ${trackSize}${trackClass}`}>
          {[...sponsors, ...sponsors].map((sponsor, index) => {
            const duplicate = index >= sponsors.length;
            return (
              <div
                key={`${sponsor.name}-${index}`}
                className={`flex shrink-0 items-center justify-center ${logoSize}${duplicate ? ' sponsor-marquee-copy' : ''}`}
                aria-hidden={duplicate || undefined}
              >
                <Image
                  src={sponsor.imageUrl}
                  alt={duplicate ? '' : sponsor.name}
                  width={large ? 160 : 144}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="sponsor-marquee-motion-control mt-3 rounded border border-white/20 px-3 py-2 text-xs text-slate-300"
        onClick={() => setPlaying(!playing)}
      >
        {playing ? 'Pause sponsor logos' : 'Play sponsor logos'}
      </button>
    </>
  );
}
