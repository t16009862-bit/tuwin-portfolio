'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Tournament {
  name: string;
  venue: string;
  tournamentSize: string;
  startDate: string;
  endDate: string;
  category: string;
  finishedPosition: string;
  status: string;
  logos: string[];
}

function formatTournamentDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime())) return startDate;
  if (Number.isNaN(end.getTime()) || endDate === startDate) {
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = sameMonth
    ? end.toLocaleDateString('en-US', { day: 'numeric' })
    : end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startLabel}–${endLabel}, ${end.getFullYear()}`;
}

export default function Tournaments() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/tournaments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tournaments');
        return res.json();
      })
      .then((data: { tournaments: Tournament[] }) => {
        if (!cancelled) setTournaments(data.tournaments);
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

  // Navigation Links - points back to homepage hashes
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Career', href: '/#career' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Media', href: '/media' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Contact', href: '/#contact' },
  ];

  const upcomingTournaments = tournaments.filter((t) => t.status.toLowerCase() === 'upcoming');
  const completedTournaments = tournaments.filter((t) => t.status.toLowerCase() === 'completed');

  const activeTournaments = activeTab === 'upcoming' ? upcomingTournaments : completedTournaments;

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
                className={`hover:text-cyan-accent transition-colors relative py-2 group ${link.href === '/tournaments' ? 'text-cyan-accent' : ''}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-cyan-accent transition-all duration-300 group-hover:w-full ${link.href === '/tournaments' ? 'w-full' : 'w-0'}`}></span>
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Tour Calendar</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
            TOURNAMENT <span className="text-gradient-cyan-solid">SCHEDULE</span>
          </h1>
          <div className="mt-4 h-[3px] w-24 bg-[#00E5FF] rounded-full"></div>
          <p className="mt-6 max-w-2xl text-sm text-slate-400 leading-relaxed mx-auto md:mx-0">
            Tuwin&apos;s tournament calendar across the PSA World Tour — from upcoming events to completed results.
          </p>
        </div>

        {/* Tournament Tabs + Grid */}
        <section className="relative z-10 pb-12">
          {/* Tab Switcher */}
          <div className="flex justify-center md:justify-start gap-2 mb-10">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'upcoming'
                  ? 'bg-cyan-accent text-black shadow-lg shadow-cyan-accent/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-accent/50 hover:text-cyan-accent'
                }`}
            >
              Upcoming Tournaments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'completed'
                  ? 'bg-cyan-accent text-black shadow-lg shadow-cyan-accent/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-accent/50 hover:text-cyan-accent'
                }`}
            >
              Completed Tournaments
            </button>
          </div>

          {isLoading ? (
            <div className="glass-card-layered p-10 text-center text-sm text-slate-400 uppercase tracking-widest font-bold">
              Loading tournaments…
            </div>
          ) : loadError ? (
            <div className="glass-card-layered p-10 text-center text-sm text-orange-accent uppercase tracking-widest font-bold">
              Unable to load tournaments right now. Please try again later.
            </div>
          ) : activeTournaments.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeTournaments.map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="glass-card-layered p-6 relative overflow-hidden group flex flex-col gap-4"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white leading-snug">{t.name}</h3>
                    {t.logos.length > 0 && (
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        {t.logos.map((logo, logoIdx) => (
                          <div key={logoIdx} className="relative h-7 w-7 rounded-md overflow-hidden bg-white/95">
                            <Image
                              src={logo}
                              alt={`${t.name} logo ${logoIdx + 1}`}
                              fill
                              sizes="28px"
                              className="object-contain p-0.5"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {t.venue && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t.venue}
                    </div>
                  )}

                  <div className="text-xs text-slate-400">
                    {formatTournamentDateRange(t.startDate, t.endDate)}
                  </div>

                  {activeTab === 'completed' && t.finishedPosition && (
                    <div className="text-sm font-bold text-cyan-accent">
                      Position: {t.finishedPosition}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-white/5">
                    {t.category && (
                      <span className="inline-block rounded-full bg-orange-accent/10 text-orange-accent px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest">
                        {t.category}
                      </span>
                    )}
                    {t.tournamentSize && (
                      <span className="inline-block rounded-full bg-white/5 text-slate-300 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest">
                        {t.tournamentSize}
                      </span>
                    )}
                    <span className={`inline-block rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${activeTab === 'upcoming' ? 'bg-cyan-accent/10 text-cyan-accent' : 'bg-white/5 text-slate-300'}`}>
                      {activeTab === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card-layered p-10 text-center text-sm text-slate-400">
              No {activeTab} tournaments to show yet.
            </div>
          )}
        </section>

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
