'use client';

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
  const trackSize = large ? 'sponsor-marquee-large' : 'opacity-75';
  const logoSize = large ? 'h-24 w-48' : 'h-16 w-36';

  return (
    <>
      <div className={className}>
        <div className={`sponsor-marquee flex w-max items-center ${trackSize}`}>
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
    </>
  );
}
