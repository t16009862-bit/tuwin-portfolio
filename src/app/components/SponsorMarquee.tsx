import Image from 'next/image';

type SponsorLogo = {
  name: string;
  imageUrl: string;
};

export default function SponsorMarquee({ sponsors, large = false }: { sponsors: SponsorLogo[]; large?: boolean }) {
  return (
    <div className="sponsor-marquee-window overflow-hidden">
      <div className="sponsor-marquee flex w-max items-center opacity-75">
        {[false, true].map((duplicate) => (
          <div
            key={Number(duplicate)}
            aria-hidden={duplicate || undefined}
            className={duplicate ? 'sponsor-marquee-copy flex gap-10 pr-10 md:gap-16 md:pr-16' : 'flex gap-10 pr-10 md:gap-16 md:pr-16'}
          >
            {sponsors.map(({ name, imageUrl }, index) => (
              <div key={index} className={`flex shrink-0 items-center justify-center ${large ? 'h-24 w-48' : 'h-16 w-36'}`}>
                <Image src={imageUrl} alt={duplicate ? '' : name} width={144} height={64} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
