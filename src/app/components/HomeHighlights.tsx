'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export type HomeArticle = {
  title: string;
  description: string;
  date: string;
  url: string;
  category: string;
};

type GalleryCategory = { key: string; label: string; images: string[] };

const initialPhotos = [
  '/tuwin_action.png',
  '/winged-falcon-racket-handover.jpg',
];

const initialWin = {
  title: 'Third place at the START PSA Satellite',
  description: 'Tuwin Herath finished third in Mumbai, India, after saving five match balls to level the deciding game at 10–10.',
  date: '22 Nov 2026',
  url: '/results/start-satellite-2026.webp',
};

function publicImage(url: string) {
  return /^https:\/\//i.test(url) || /^\/(?!\/)/.test(url);
}

export default function HomeHighlights({ featured, win }: { featured?: HomeArticle; win?: HomeArticle }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const result = win ?? initialWin;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/gallery', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Gallery unavailable');
        return response.json() as Promise<{ categories: GalleryCategory[] }>;
      })
      .then(({ categories }) => {
        const featuredCategory = categories.find(({ key }) => key.trim().toLowerCase() === 'featured post');
        const gallery = categories.find(({ key }) => key.trim().toLowerCase() === 'international');
        const images = [...new Set((featuredCategory?.images.length ? featuredCategory.images : gallery?.images ?? []).filter(publicImage))];
        if (images.length && !controller.signal.aborted) setPhotos(images);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setInterval(() => {
      if (!document.hidden && !motion.matches) setCurrent((index) => (index + 1) % photos.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, photos.length]);

  const currentPhoto = current % photos.length;
  const card = 'grid min-w-0 grid-cols-[5.75rem_minmax(0,1fr)] gap-3 rounded-2xl border bg-[#0c131d] p-3 sm:grid-cols-[7.25rem_minmax(0,1fr)] sm:gap-4 sm:p-4';
  const frame = 'aspect-[4/5] overflow-hidden rounded-lg border bg-white/5 p-1';
  const label = 'text-[10px] font-bold uppercase tracking-[0.18em]';
  const title = 'mt-1.5 text-sm font-extrabold leading-snug text-white sm:text-base';
  const description = 'mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-300';

  return (
    <div className="mb-5 grid gap-4 md:grid-cols-2">
      <article className={card + ' border-cyan-accent/20'} aria-label="Featured post">
        <div className={frame + ' border-cyan-accent/30'}>
          {/* Gallery URLs are managed externally and can come from different hosts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[currentPhoto]} alt={`Squash gallery photo ${currentPhoto + 1}`} loading="lazy" className="size-full rounded-md object-cover" />
        </div>
        <div className="self-center">
          <p className={label + ' text-cyan-accent'}>Featured Post</p>
          <h3 className={title}>{featured?.title || 'On court and on tour'}</h3>
          <p className={description}>{featured?.description || 'Photos from training and competition on the squash circuit.'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
            <Link href="/gallery" className="text-cyan-accent hover:underline">View gallery</Link>
            {photos.length > 1 && (
              <>
                <button type="button" className="py-1 text-slate-300 hover:text-white" onClick={() => setCurrent((index) => (index + 1) % photos.length)} aria-label="Next gallery photo">Next →</button>
                <button type="button" className="py-1 text-slate-300 hover:text-white" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume gallery rotation' : 'Pause gallery rotation'}>{paused ? 'Play' : 'Pause'}</button>
              </>
            )}
          </div>
        </div>
      </article>
      <article className={card + ' border-amber-300/25'} aria-label="Recent wins">
        <div className={frame + ' border-amber-300/45'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicImage(result.url) ? result.url : initialWin.url} alt="Tuwin Herath holding his squash racket on court" loading="lazy" className="size-full rounded-md object-cover object-[50%_68%]" />
        </div>
        <div className="self-center">
          <p className={label + ' text-amber-300'}>Recent Wins</p>
          <h3 className={title}>{result.title}</h3>
          <p className={description}>{result.description}</p>
          {result.date && <p className="mt-2 text-[11px] text-slate-400">{result.date}</p>}
        </div>
      </article>
    </div>
  );
}
