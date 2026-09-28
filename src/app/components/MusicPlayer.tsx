'use client';

import { useEffect, useState } from 'react';

type MusicSettings = {
  enabled: boolean;
  title: string;
  artist: string;
  youtubeId: string;
};

const DEFAULT_MUSIC: MusicSettings = {
  enabled: true,
  title: 'Hall of Fame',
  artist: 'The Script ft. will.i.am',
  youtubeId: 'mk48xRzuNvA',
};

export default function MusicPlayer() {
  const [settings, setSettings] = useState(DEFAULT_MUSIC);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/site-music', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Music settings are unavailable');
        return response.json() as Promise<MusicSettings>;
      })
      .then((data) => {
        if (!cancelled && data.youtubeId) setSettings(data);
      })
      .catch(() => {
        // Keep the bundled setting when Google Sheets is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!settings.enabled) return null;

  return (
    <aside className="fixed bottom-4 left-4 z-[70] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cyan-accent/25 bg-[#080b12]/95 shadow-2xl shadow-black/50 backdrop-blur-xl" aria-label="Website music player">
      {playing && (
        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${settings.youtubeId}?autoplay=1&playsinline=1&rel=0`}
            title={`${settings.title} by ${settings.artist}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-accent text-sm font-black text-black transition-transform hover:scale-105"
          aria-label={playing ? 'Stop Hall of Fame' : 'Play Hall of Fame'}
        >
          {playing ? '■' : '▶'}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-extrabold uppercase tracking-wider text-white">{settings.title}</p>
          <p className="truncate text-[10px] text-slate-400">{settings.artist}</p>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-accent">{playing ? 'Playing' : 'Play song'}</span>
      </div>
    </aside>
  );
}
