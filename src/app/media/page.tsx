'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MediaItem {
  id: string;
  category: string;
  source: string;
  date: string;
  title: string;
  description: string;
  linkText: string;
  url: string;
}

// Category text drives which card layout is used (interview/profile/archive/article)
function getCardType(category: string): 'interview' | 'profile' | 'archive' | 'article' {
  const c = category.toLowerCase();
  if (c.includes('interview')) return 'interview';
  if (c.includes('profile')) return 'profile';
  if (c.includes('archive')) return 'archive';
  return 'article';
}

const profileIcon = (
  <svg className="w-10 h-10 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export default function MediaPress() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sponsors, setSponsors] = useState<{ name: string; imageUrl: string; status: string; description: string }[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/media')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load media items');
        return res.json();
      })
      .then((data: MediaItem[]) => {
        if (!cancelled) setMediaItems(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/sponsors')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sponsors');
        return res.json();
      })
      .then((data: { sponsors: { name: string; imageUrl: string; status: string; description: string }[] }) => {
        if (!cancelled) setSponsors(data.sponsors);
      })
      .catch(() => {
        // Keep empty sponsors list on failure
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Navigation Links - points back to homepage hashes
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Career', href: '/#career' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Media', href: '/media' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/#contact' },
  ];

  const categories = ['All', ...Array.from(new Set(mediaItems.map((item) => item.category)))];

  const filteredItems = activeCategory === 'All'
    ? mediaItems
    : mediaItems.filter(item => item.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-[#06070a] text-white font-sans selection:bg-cyan-accent selection:text-black">
      {/* Background aurora gradients */}
      <div className="aurora-bg"></div>

      {/* Subtle overlay grid */}
      <div className="absolute inset-0 grid-overlay opacity-[0.15] pointer-events-none z-0"></div>

      {/* Repeating organic wave contour lines texture */}
      <div className="wave-contour-pattern"></div>

      {/* Header & Navigation */}
      <header className="animate-slide-down sticky top-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto w-full max-w-6xl px-6 flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold uppercase tracking-widest text-white hover:text-cyan-accent transition-colors">
            Tuwin <span className="text-cyan-accent text-gradient-cyan-solid font-extrabold">Herath</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-cyan-accent transition-colors relative py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Header Button */}
          <Link
            href="/#contact-form"
            className="hidden rounded-full border border-cyan-accent/50 bg-cyan-accent/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all duration-300 md:inline-flex shadow-sm hover:shadow-cyan-accent/20"
          >
            Get In Touch
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-200 hover:text-cyan-accent transition-colors md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
            <span className="text-lg">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`md:hidden border-t border-white/5 bg-[#06070a]/95 backdrop-blur-lg px-6 py-6 transition-all duration-300 ${isMobileMenuOpen ? 'block opacity-100' : 'hidden opacity-0'
            }`}
        >
          <div className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-cyan-accent py-2 transition-colors border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/#contact-form"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-cyan-accent bg-cyan-accent/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 space-y-12">

        {/* Title Header */}
        <div className="text-center md:text-left py-6 relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Media &amp; Press Coverage</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
            MEDIA &amp; <span className="text-gradient-cyan-solid">PRESS</span>
          </h1>
          <div className="mt-4 h-[3px] w-24 bg-[#00E5FF] rounded-full"></div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-[69px] z-40 bg-[#06070a]/85 backdrop-blur-md py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex overflow-x-auto gap-2 py-1 no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeCategory === cat
                  ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20'
                  : 'border border-white/10 hover:border-white/30 text-slate-400 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Showing {filteredItems.length} Items
          </span>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-400 uppercase tracking-widest font-bold">
            Loading media coverage…
          </div>
        ) : loadError ? (
          <div className="py-20 text-center text-sm text-orange-accent uppercase tracking-widest font-bold">
            Unable to load media coverage right now. Please try again later.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const cardType = getCardType(item.category);

              if (cardType === 'article') {
                return (
                  <div key={item.id} className="glass-card-layered overflow-hidden flex flex-col justify-between group">
                    <div>
                      <div className="p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <span className="rounded-full bg-orange-accent/10 border border-orange-accent/30 text-orange-accent px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            <span>{item.source}</span>
                            {item.date && (
                              <>
                                <span className="text-slate-600">•</span>
                                <span>{item.date}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-accent transition-colors uppercase font-sans pt-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-4">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-orange-accent hover:bg-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 shadow-md hover:shadow-orange-accent/25 hover:translate-y-[-2px] cursor-pointer"
                      >
                        {item.linkText || 'Read Article'}
                      </a>
                    </div>
                  </div>
                );
              }

              if (cardType === 'interview') {
                return (
                  <div key={item.id} className="glass-card-layered-orange p-6 flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute right-4 top-2 text-7xl font-black text-white/5 select-none pointer-events-none">“</div>

                    <div className="space-y-4">
                      <span className="inline-block rounded-full bg-cyan-accent/10 text-cyan-accent px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest">
                        {item.category}
                      </span>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        <span>{item.source}</span>
                        <span>{item.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-orange-accent transition-colors uppercase font-sans">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 italic leading-relaxed pl-3 border-l-2 border-orange-accent/40 font-sans">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-accent group-hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{item.linkText || 'Read Interview'}</span>
                        <span className="text-sm">→</span>
                      </a>
                    </div>
                  </div>
                );
              }

              if (cardType === 'profile') {
                return (
                  <div key={item.id} className="glass-card-layered p-6 flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute right-6 top-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                      {profileIcon}
                    </div>
                    <div className="space-y-4">
                      <span className="inline-block rounded-full bg-cyan-accent/10 text-cyan-accent px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white/5 p-2 flex-shrink-0 group-hover:bg-[#00E5FF]/10 transition-colors duration-300">
                          {profileIcon}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-accent transition-colors uppercase font-sans">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full border border-cyan-accent/40 hover:border-cyan-accent bg-cyan-accent/5 hover:bg-cyan-accent hover:text-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-cyan-accent transition-all duration-300 cursor-pointer"
                      >
                        {item.linkText || 'View Profile'}
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.id} className="glass-card-layered-orange p-6 flex flex-col justify-between group relative overflow-hidden">
                  <div className="space-y-4">
                    <span className="inline-block rounded-full bg-orange-accent/10 text-orange-accent px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-orange-accent transition-colors uppercase font-sans">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 hover:border-orange-accent bg-[#06070a] hover:bg-orange-accent/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-orange-accent transition-all duration-300 cursor-pointer"
                    >
                      {item.linkText || 'Browse Archive'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section 3: Press Kit Banner */}
        <section className="relative z-10 py-8">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-accent/20 bg-gradient-to-r from-[#0d111a] via-[#05060b] to-[#0e121d] p-8 md:p-12 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-accent/30 bg-cyan-accent/5 px-4 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-accent shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse"></span>
                  For Journalists &amp; Media Outlets
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none font-sans">
                  OFFICIAL <span className="text-gradient-cyan-solid">PRESS KIT</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  View the complete press package containing official career bios, ranking statistics, and contact specifications.
                </p>
              </div>

              <div className="flex-shrink-0">
                <a
                  href="/tuwin_portfolio.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border-2 border-cyan-accent bg-cyan-accent/10 hover:bg-cyan-accent hover:text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-accent transition-all duration-300 shadow-lg shadow-cyan-accent/15 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View PDF</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Scrolling Sponsor Ribbon Ticker */}
        {sponsors.length > 0 && (
          <section className="py-12 border-t border-white/5">
            <p className="text-center text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500 mb-8">
              Official Partners &amp; Sponsors
            </p>

            {/* Scrolling ticker track */}
            <div className="relative w-full overflow-hidden py-4 bg-slate-900/10 border-y border-white/5">
              <div className="flex w-max gap-16 items-center animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] opacity-75">
                {[...sponsors, ...sponsors].map((sponsor, idx) => (
                  <div
                    key={`${sponsor.name}-${idx}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-36"
                  >
                    <Image
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      width={144}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#06070a] py-12 relative z-10">
        <div className="mx-auto w-full max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-base font-bold uppercase tracking-widest text-white font-sans">
              Tuwin <span className="text-cyan-accent">Herath</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-sans">
              Professional Squash Athlete Portfolio
            </p>
            <div className="flex gap-4 mt-3">
              <a href="https://www.instagram.com/tuwin.herath?igsh=MjZmNG84NDF5dGdn" className="p-2 bg-white/5 rounded-full text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04 1.23.328 1.97.772 2.392A3.9 3.9 0 0 0 1.417 14.6c.51.198 1.09.333 1.942.372C5.555 14.99 5.827 15 8.001 15s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.42.773-1.16.772-2.392.04-.852.048-1.124.048-3.297 0-2.174-.01-2.446-.048-3.297-.04-1.23-.328-1.97-.772-2.392a3.9 3.9 0 0 0-1.417-.923c-.51-.198-1.09-.333-1.942-.372C10.443.01 10.172 0 7.999 0zm-.08 1.44h.08c2.113 0 2.36.007 3.194.045.765.035 1.18.164 1.457.272.369.144.632.316.91.593s.45.541.592.91c.108.277.237.692.272 1.457.038.834.045 1.077.045 3.193v.08c0 2.113-.007 2.36-.045 3.194-.035.765-.164 1.18-.272 1.457a3.9 3.9 0 0 1-.91.593c-.277.108-.692.237-1.457.272-.834.038-1.077.045-3.193.045h-.08c-2.113 0-2.36-.007-3.194-.045-.765-.035-1.18-.164-1.457-.272a3.9 3.9 0 0 1-.91-.593c-.277-.108-.692-.237-1.457-.272-.834-.038-1.077-.045-3.193-.045zm0 2.456a3.906 3.906 0 1 0 0 7.812 3.906 3.906 0 0 0 0-7.812m0 5.837a1.931 1.931 0 1 1 0-3.862 1.931 1.931 0 0 1 0 3.862M4.93-4.831a1.156 1.156 0 1 1-2.31 0 1.156 1.156 0 0 1 2.31 0" />
                </svg>
              </a>
              <a href="mailto:tuwinosanda@gmail.com" className="p-2 bg-white/5 rounded-full text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
              </a>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-sans">
              Designed with precision, focus, and clean athletic style.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-xs text-slate-400 md:text-right font-sans">
            <p>© {new Date().getFullYear()} Tuwin Herath. Designed &amp; Developed by Zerone.</p>
            <p className="text-[10px] text-slate-500">All rights reserved. Unauthorized reproduction is prohibited.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
