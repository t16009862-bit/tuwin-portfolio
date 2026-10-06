'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Sponsor {
  name: string;
  imageUrl: string;
  status: string;
  description: string;
}

export default function Sponsors() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'former'>('current');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/sponsors')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sponsors');
        return res.json();
      })
      .then((data: { sponsors: Sponsor[] }) => {
        if (!cancelled) setSponsors(data.sponsors);
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

  const currentSponsors = sponsors.filter((s) => s.status === 'current');
  const formerSponsors = sponsors.filter((s) => s.status === 'former');

  const activeSponsors = activeTab === 'current' ? currentSponsors : formerSponsors;

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
                className={`hover:text-cyan-accent transition-colors relative py-2 group ${link.href === '/sponsors' ? 'text-cyan-accent' : ''}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-cyan-accent transition-all duration-300 group-hover:w-full ${link.href === '/sponsors' ? 'w-full' : 'w-0'}`}></span>
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Sponsors &amp; Partners</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
            POWERED BY THE <span className="text-gradient-cyan-solid">BEST</span>
          </h1>
          <div className="mt-4 h-[3px] w-24 bg-[#00E5FF] rounded-full"></div>
          <p className="mt-6 max-w-2xl text-sm text-slate-400 leading-relaxed mx-auto md:mx-0">
            The brands and partners backing Tuwin&apos;s journey on the PSA World Tour, from travel and equipment to apparel and conditioning.
          </p>
        </div>

        {/* Sponsors Tabs + Marquee */}
        <section className="relative z-10 pb-12">
          {/* Tab Switcher */}
          <div className="flex justify-center md:justify-start gap-2 mb-10">
            <button
              type="button"
              onClick={() => setActiveTab('current')}
              className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'current'
                  ? 'bg-cyan-accent text-black shadow-lg shadow-cyan-accent/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-accent/50 hover:text-cyan-accent'
                }`}
            >
              Current Sponsors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('former')}
              className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'former'
                  ? 'bg-cyan-accent text-black shadow-lg shadow-cyan-accent/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-accent/50 hover:text-cyan-accent'
                }`}
            >
              Former Sponsors
            </button>
          </div>

          {/* Scrolling Logo Marquee */}
          {isLoading ? (
            <div className="glass-card-layered p-10 text-center text-sm text-slate-400 uppercase tracking-widest font-bold">
              Loading sponsors…
            </div>
          ) : loadError ? (
            <div className="glass-card-layered p-10 text-center text-sm text-orange-accent uppercase tracking-widest font-bold">
              Unable to load sponsors right now. Please try again later.
            </div>
          ) : activeSponsors.length > 0 ? (
            <>
              <div className="relative w-full overflow-hidden py-10 glass-card-layered">
                <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>
                <div
                  key={activeTab}
                  className="flex w-max gap-10 items-center animate-[marquee_22s_linear_infinite] hover:[animation-play-state:paused]"
                >
                  {[...activeSponsors, ...activeSponsors].map((sponsor, idx) => (
                    <div
                      key={`${sponsor.name}-${idx}`}
                      className="flex-shrink-0 flex items-center justify-center h-24 w-48"
                    >
                      <Image
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        width={160}
                        height={64}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sponsor Descriptions */}
              <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2">
                {activeSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="glass-card-layered p-6 flex items-start gap-4 relative overflow-hidden"
                  >
                    <div className="flex-shrink-0 relative h-14 w-14 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-white">{sponsor.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{sponsor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="glass-card-layered p-10 text-center text-sm text-slate-400">
              No {activeTab} sponsors to show yet.
            </div>
          )}
        </section>

        {/* Become a Sponsor CTA */}
        <section className="glass-card-layered p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
              Interested in Partnering?
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Open for new sponsorships and brand collaborations as Tuwin pushes for the PSA World Tour top rankings this season.
            </p>
            <Link
              href="/packages"
              className="inline-flex items-center justify-center rounded-full bg-cyan-accent px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-cyan-300 hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-cyan-accent/35 cursor-pointer"
            >
              Become A Sponsor
            </Link>
          </div>
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
