'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RankingChart from './components/RankingChart';

type BiographyHighlight = { title: string; heading: string; description: string };

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

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [bio, setBio] = useState({
    name: 'Tuwin Herath',
    worldRank: '316',
    age: '26',
    description: 'PSA Touring Professional. Deshabandu Awardee. Fueling the game with the best. Representing the Sri Lankan flag on the international stage, pushing the physical and mental limits of competitive squash.',
  });
  const [sponsors, setSponsors] = useState<{ name: string; imageUrl: string; status: string; description: string }[]>([]);
  const [rankings, setRankings] = useState<{ date: string; ranking: number }[]>([]);
  const [tournaments, setTournaments] = useState<{
    name: string;
    venue: string;
    tournamentSize: string;
    startDate: string;
    endDate: string;
    category: string;
    status: string;
    logos: string[];
  }[]>([]);
  const [coaches, setCoaches] = useState<{ name: string; profile: string[]; biography: string; imageUrl: string }[]>([]);
  const [expandedBios, setExpandedBios] = useState<Set<number>>(new Set());
  const [careerAchievements, setCareerAchievements] = useState<{ title: string; heading: string; description: string; footer: string }[]>([]);
  const [timelineData, setTimelineData] = useState<{ year: string; title: string; description: string; tag: string; icon: string }[]>([]);
  const [competencyPoints, setCompetencyPoints] = useState<string[]>([]);
  const [trainingHistory, setTrainingHistory] = useState<{ title: string; heading: string; description: string }[]>([]);
  const [biography, setBiography] = useState<{ description: string; highlights: BiographyHighlight[] }>({
    description: 'Representing the Sri Lankan flag on the international stage, Tuwin has spent over a decade pushing the physical and mental limits of competitive squash. A former Head Boy and Best Sportsman of D.S. Senanayake College, he was awarded the Deshabandu title at age 21 for his outstanding athletic achievements and community service during the global pandemic. Currently competing on the PSA Squash Tour, Tuwin continues to elevate the standard of Sri Lankan squash globally, backed by professional training regimes, clean sport practices, and active community outreach.',
    highlights: [],
  });
  const [contact, setContact] = useState({
    locations: 'Malabe, Sri Lanka / Shanghai, China',
    email: 'tuwinosanda@gmail.com',
    phoneNumbers: ['+94771182429', '+8613002144061'],
  });
  const TOTAL_FETCHES = 11;
  const [loadedCount, setLoadedCount] = useState(0);
  const isPageLoading = loadedCount < TOTAL_FETCHES;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/bio')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load bio');
        return res.json();
      })
      .then((data: { name?: string; worldRank?: string; age?: string; description?: string }) => {
        if (cancelled) return;
        setBio((prev) => ({
          name: data.name || prev.name,
          worldRank: data.worldRank || prev.worldRank,
          age: data.age || prev.age,
          description: data.description || prev.description,
        }));
      })
      .catch(() => {
        // Keep default bio values on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
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
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/rankings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load rankings');
        return res.json();
      })
      .then((data: { rankings: { date: string; ranking: number }[] }) => {
        if (!cancelled) setRankings(data.rankings);
      })
      .catch(() => {
        // Keep empty rankings list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/tournaments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tournaments');
        return res.json();
      })
      .then((data: { tournaments: (typeof tournaments[number] & { finishedPosition?: string })[] }) => {
        if (!cancelled) {
          setTournaments(data.tournaments.filter((t) => t.status.toLowerCase() === 'upcoming'));
        }
      })
      .catch(() => {
        // Keep empty tournaments list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/coach')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load coach');
        return res.json();
      })
      .then((data: { coaches: typeof coaches }) => {
        if (!cancelled) setCoaches(data.coaches);
      })
      .catch(() => {
        // Keep empty coaches list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/contact')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load contact');
        return res.json();
      })
      .then((data: { contact: { locations?: string; email?: string; phoneNumbers?: string[] } }) => {
        if (cancelled) return;
        setContact((prev) => ({
          locations: data.contact.locations || prev.locations,
          email: data.contact.email || prev.email,
          phoneNumbers: data.contact.phoneNumbers && data.contact.phoneNumbers.length > 0 ? data.contact.phoneNumbers : prev.phoneNumbers,
        }));
      })
      .catch(() => {
        // Keep default contact values on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/career-achievements')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load career achievements');
        return res.json();
      })
      .then((data: { achievements: typeof careerAchievements }) => {
        if (!cancelled) setCareerAchievements(data.achievements);
      })
      .catch(() => {
        // Keep empty career achievements list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/career-highlights')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load career highlights');
        return res.json();
      })
      .then((data: { highlights: typeof timelineData }) => {
        if (!cancelled) setTimelineData(data.highlights);
      })
      .catch(() => {
        // Keep empty timeline list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/competency-blueprint')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load competency blueprint');
        return res.json();
      })
      .then((data: { points: string[] }) => {
        if (!cancelled) setCompetencyPoints(data.points);
      })
      .catch(() => {
        // Keep empty competency points list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/training-history')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load training history');
        return res.json();
      })
      .then((data: { trainingHistory: typeof trainingHistory }) => {
        if (!cancelled) setTrainingHistory(data.trainingHistory);
      })
      .catch(() => {
        // Keep empty training history list on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/biography')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load biography');
        return res.json();
      })
      .then((data: { description?: string; highlights?: BiographyHighlight[] }) => {
        if (cancelled) return;
        setBiography((prev) => ({
          description: data.description || prev.description,
          highlights: data.highlights && data.highlights.length > 0 ? data.highlights : prev.highlights,
        }));
      })
      .catch(() => {
        // Keep default biography values on failure
      })
      .finally(() => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [bioFirstName, ...bioLastNameParts] = bio.name.trim().split(' ');
  const bioLastName = bioLastNameParts.join(' ');

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInquiryStatus('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      });
      if (!res.ok) throw new Error('Request failed');
      setInquiryStatus('success');
      setInquiryForm({ name: '', email: '', message: '' });
    } catch {
      setInquiryStatus('error');
    }
  };

  // Navigation Links
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Career', href: '#career' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Media', href: '/media' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Partners', href: '#partners' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="relative min-h-screen bg-[#06070a] text-white font-sans selection:bg-cyan-accent selection:text-black">
      {/* Loading Screen */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-[#06070a]">
          <div className="h-12 w-12 rounded-full border-2 border-cyan-accent/20 border-t-cyan-accent animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Loading</p>
        </div>
      )}

      {/* Background aurora gradients */}
      <div className="aurora-bg"></div>

      {/* Subtle overlay grid */}
      <div className="absolute inset-0 grid-overlay opacity-[0.15] pointer-events-none z-0"></div>

      {/* Repeating organic wave contour lines texture */}
      <div className="wave-contour-pattern"></div>

      {/* Header & Navigation */}
      <header className="animate-slide-down sticky top-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto w-full max-w-6xl px-6 flex items-center justify-between py-4">
          <a href="#home" className="text-xl font-bold uppercase tracking-widest text-white hover:text-cyan-accent transition-colors">
            {bioFirstName} <span className="text-cyan-accent text-gradient-cyan-solid font-extrabold">{bioLastName}</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-cyan-accent transition-colors relative py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* CTA Header Buttons */}
          <div className="hidden items-center gap-3 md:flex">
           
            <a
              href="#contact"
              className="rounded-full border border-cyan-accent/50 bg-cyan-accent/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all duration-300 shadow-sm hover:shadow-cyan-accent/20"
            >
              Get In Touch
            </a>
             <Link
              href="/sponsors"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-200 hover:border-cyan-accent/50 hover:text-cyan-accent transition-all duration-300 shadow-sm"
            >
              Sponsors
            </Link>
          </div>

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
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-cyan-accent py-2 transition-colors border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <Link
              href="/sponsors"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-200 hover:border-cyan-accent/50 hover:text-cyan-accent transition-all"
            >
              Sponsors
            </Link>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-cyan-accent bg-cyan-accent/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-6">

        {/* 1. Hero Section */}
        <section id="home" className="relative overflow-hidden flex min-h-[90vh] flex-col items-center justify-center py-16 lg:py-24 lg:flex-row lg:justify-between gap-12 border-b border-white/5">

          {/* Large Ghosted Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-[7rem] sm:text-[11rem] md:text-[14rem] font-black uppercase tracking-widest text-cyan-accent z-0 text-center w-full leading-none">
            READY TO COMPETE
          </div>

          <div className="order-2 lg:order-1 flex-1 space-y-6 text-center lg:text-left animate-fade-in z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-accent/30 bg-cyan-accent/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-accent shadow-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-accent animate-ping"></span>
              Sri Lanka • Squash • Elite Performance
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-8xl text-white leading-none uppercase">
              {bioFirstName} <br />
              <span className="text-gradient-cyan-solid font-black">{bioLastName}</span>
            </h1>

            <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-orange-accent sm:text-2xl">
              International Squash Player <span className="text-white">•</span> PSA Touring Professional
            </h2>

            <p className="mx-auto lg:mx-0 max-w-lg text-justify text-base text-white/90 leading-relaxed md:text-lg">
              {bio.description}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#career"
                className="inline-flex items-center justify-center rounded-full bg-orange-accent px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-600 hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-orange-accent/35 cursor-pointer"
              >
                View Achievements
              </a>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center rounded-full bg-cyan-accent px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-cyan-300 hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-cyan-accent/35 cursor-pointer"
              >
                Become A Sponsor
              </Link>
            
            </div>
          </div>

          {/* Headshot/Action pose container */}
          <div className="order-1 lg:order-2 flex-1 flex justify-center items-center lg:justify-end z-10 relative">
            <div className="relative group">
              {/* Floating Badge 1 - Age/Height */}
              <div className="absolute -top-6 -left-6 z-20 animate-float-soft glass-card-layered px-5 py-3 border border-cyan-accent/20 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-accent">Athlete Specs</div>
                  <div className="text-sm font-black text-white">{bio.age} YRS • 171CM</div>
                </div>
              </div>

              {/* Floating Badge 2 - Peak WR */}
              <div className="absolute -bottom-6 -right-6 z-20 animate-float-delayed glass-card-layered-orange px-5 py-3 border border-orange-accent/20 flex items-center gap-3">
                <span className="text-2xl text-orange-accent">🏆</span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-accent">Peak World Rank</div>
                  <div className="text-sm font-black text-white">WR No. {bio.worldRank}</div>
                </div>
              </div>

              {/* Glowing aura rings */}
              <div className="absolute -inset-4 rounded-full bg-radial from-cyan-accent/15 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 rounded-full border border-cyan-accent/20 scale-105 opacity-50 group-hover:scale-110 group-hover:border-cyan-accent/40 transition-all duration-500"></div>
              <div className="absolute -inset-2 rounded-full border border-orange-accent/10 scale-110 opacity-30 group-hover:scale-120 transition-all duration-500"></div>

              {/* Racket abstract shapes behind */}
              <div className="absolute -top-10 -right-10 w-32 h-32 border border-white/5 rounded-full rotate-45 pointer-events-none opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 border border-white/5 rounded-full pointer-events-none opacity-20"></div>

              {/* Stylized Image Frame */}
              <div className="relative h-80 w-80 sm:h-[400px] sm:w-[400px] overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-[#0e121d] to-[#06070a] p-3 shadow-2xl">
  <Image
    src="/tuwin-cover-square.jpg"
    alt="Tuwin Herath Squash Athlete Profile Photo"
    fill
    className="rounded-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"    sizes="(max-width: 640px) 296px, 380px"
    priority
  />
</div>
            </div>
          </div>
        </section>

        {/* 2. Stats Section */}
        <section id="about" className="py-16 border-b border-white/5 relative">
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">

            {/* Age Card */}
            <div className="glass-card-layered p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-[0.03] wave-contour-pattern pointer-events-none"></div>

              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1 z-10 relative">Age</p>
              <p className="text-4xl font-extrabold text-cyan-accent text-gradient-cyan-solid tracking-tight md:text-5xl z-10 relative">{bio.age}</p>
              <div className="mt-2 text-[9px] uppercase font-bold text-slate-500 tracking-[0.1em] z-10 relative">Active Competitor</div>
            </div>

            {/* Height Card */}
            <div className="glass-card-layered-orange p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-[0.03] wave-contour-pattern pointer-events-none"></div>

              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1 z-10 relative">Height</p>
              <p className="text-4xl font-extrabold text-orange-accent text-gradient-orange tracking-tight md:text-5xl z-10 relative">171<span className="text-lg">cm</span></p>
              <div className="mt-2 text-[9px] uppercase font-bold text-slate-500 tracking-[0.1em] z-10 relative">Optimized Build</div>
            </div>

            {/* PSA Joined Card */}
            <div className="glass-card-layered p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-[0.03] wave-contour-pattern pointer-events-none"></div>

              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1 z-10 relative">PSA Joined</p>
              <p className="text-4xl font-extrabold text-white tracking-tight md:text-5xl z-10 relative">2023</p>
              <div className="mt-2 text-[9px] uppercase font-bold text-cyan-accent tracking-[0.1em] z-10 relative">Touring Professional</div>
            </div>

            {/* Peak WR Card */}
            <div className="glass-card-layered-orange p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-[0.03] wave-contour-pattern pointer-events-none"></div>

              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1 z-10 relative">Peak WR</p>
              <p className="text-4xl font-extrabold text-orange-accent text-gradient-orange tracking-tight md:text-5xl z-10 relative">{bio.worldRank}</p>
              <div className="mt-2 text-[9px] uppercase font-bold text-slate-500 tracking-[0.1em] z-10 relative">Career Landmark</div>
            </div>

          </div>
        </section>

        {/* Upcoming Tournaments */}
        {tournaments.length > 0 && (
          <section className="py-16 border-b border-white/5 relative z-10">
            <div className="text-center md:text-left mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Tour Calendar</p>
              <Link href="/tournaments" className="inline-block group">
                <h3 className="text-3xl font-extrabold tracking-tight text-white uppercase md:text-4xl group-hover:text-cyan-accent transition-colors">
                  Upcoming Tournaments
                </h3>
              </Link>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.slice(0, 3).map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="glass-card-layered p-6 relative overflow-hidden group flex flex-col gap-4"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-bold uppercase tracking-wide text-white leading-snug">{t.name}</h4>
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
                    <span className="inline-block rounded-full bg-cyan-accent/10 text-cyan-accent px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Biography Section */}
        <section id="bio" className="py-24 border-b border-white/5 relative overflow-hidden">

          {/* Large Ghosted Background Text */}
          <div className="absolute top-1/4 right-0 select-none pointer-events-none opacity-[0.015] text-[8rem] sm:text-[12rem] font-black uppercase tracking-widest text-white z-0">
            THE JOURNEY
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
            {/* Bio Column */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Biography</p>
                <h3 className="text-3xl font-extrabold tracking-tight text-white uppercase md:text-4xl">
                  The Journey &amp; Legacy
                </h3>
              </div>
              <div className="h-[3px] w-16 bg-cyan-accent rounded-full"></div>

              <div className="space-y-4 text-justify text-slate-300 leading-relaxed text-sm sm:text-base">
                <p>{biography.description}</p>
              </div>

              {/* Languages Subgrid */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-accent opacity-30"></div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">English</div>
                  <div className="text-sm font-bold text-cyan-accent">Fluent</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-accent opacity-30"></div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sinhala</div>
                  <div className="text-sm font-bold text-cyan-accent">Fluent</div>
                </div>
              </div>
            </div>

            {/* Special Highlights */}
            <div className="flex-1 w-full space-y-6">
              {biography.highlights.map((highlight, idx) => {
                const isOrange = idx % 2 === 1;
                const icons = [
                  'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
                  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                  'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                ];
                return (
                  <div
                    key={`${highlight.heading}-${idx}`}
                    className={`relative overflow-hidden p-8 border bg-gradient-to-br to-transparent ${isOrange ? 'glass-card-layered-orange border-orange-accent/20 from-orange-accent/5' : 'glass-card-layered border-cyan-accent/20 from-cyan-accent/5'}`}
                  >
                    <div className="absolute right-4 top-2 text-7xl font-black text-white/5 select-none pointer-events-none">
                      #{String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-3 ring-1 flex-shrink-0 ${isOrange ? 'bg-orange-accent/10 text-orange-accent ring-orange-accent/30' : 'bg-cyan-accent/10 text-cyan-accent ring-cyan-accent/30'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icons[idx % icons.length]} />
                        </svg>
                      </div>

                      <div className="space-y-3">
                        {highlight.title && (
                          <span className={`inline-block rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${isOrange ? 'bg-orange-accent text-white' : 'bg-cyan-accent text-black'}`}>
                            {highlight.title}
                          </span>
                        )}
                        <h4 className="text-xl font-bold tracking-tight text-white uppercase">
                          {highlight.heading}
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* World Ranking Chart */}
        {rankings.length > 0 && (
          <section className="py-16 border-b border-white/5 relative z-10">
            <RankingChart rankings={rankings} />
          </section>
        )}

        {/* Coach & Club */}
        {coaches.length > 0 && (
          <section className="py-16 border-b border-white/5 relative z-10">
            <div className="text-center md:text-left mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Behind The Game</p>
              <h3 className="text-3xl font-extrabold tracking-tight text-white uppercase md:text-4xl">
                Coach &amp; Club
              </h3>
            </div>

            <div className="space-y-8">
              {coaches.map((coach, idx) => (
                <div
                  key={`${coach.name}-${idx}`}
                  className="glass-card-layered p-8 relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>

                  {/* Left: Image + Name + Biography */}
                  <div className="relative z-10 space-y-4 text-center md:text-left">
                    {coach.imageUrl && (
                      <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto md:mx-0 rounded-2xl overflow-hidden border border-cyan-accent/20 bg-white/5">
                        <Image
                          src={coach.imageUrl}
                          alt={coach.name}
                          fill
                          sizes="(max-width: 768px) 192px, 256px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h4 className="text-lg font-bold uppercase tracking-wide text-white">{coach.name}</h4>
                    {coach.biography && (
                      <div>
                        <p className={`text-sm text-slate-300 leading-relaxed text-justify ${expandedBios.has(idx) ? '' : 'line-clamp-5'}`}>
                          {coach.biography}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedBios((prev) => {
                              const next = new Set(prev);
                              if (next.has(idx)) {
                                next.delete(idx);
                              } else {
                                next.add(idx);
                              }
                              return next;
                            });
                          }}
                          className="mt-1 text-xs font-bold uppercase tracking-widest text-cyan-accent hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          {expandedBios.has(idx) ? 'See Less' : 'See More'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Profile Points */}
                  {coach.profile.length > 0 && (
                    <div className="relative z-10">
                      <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-4">Profile</h5>
                      <ul className="space-y-2.5">
                        {coach.profile.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-300">
                            <svg
                              className="h-4 w-4 flex-shrink-0 mt-0.5 text-cyan-accent"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-justify">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Career Timeline & Achievements */}
        <section id="career" className="py-24 border-b border-white/5 space-y-16 relative overflow-hidden">

          {/* Large Ghosted Background Text */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 select-none pointer-events-none opacity-[0.015] text-[7rem] sm:text-[10rem] font-black uppercase tracking-widest text-white z-0">
            PSA WORLD TOUR
          </div>

          <div className="text-center relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Tour Highlights</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-white uppercase md:text-4xl">
              Career Achievements
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-400 uppercase tracking-widest">
              Proven results across international circuits and national representations.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 relative z-10">
            {careerAchievements.map((achievement, idx) => {
              const isOrange = idx % 2 === 1;
              const icons = [
                'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
                'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
                'M13 10V3L4 14h7v7l9-11h-7z',
              ];
              return (
                <div
                  key={`${achievement.title}-${idx}`}
                  className={`p-6 relative overflow-hidden group flex flex-col justify-between ${isOrange ? 'glass-card-layered-orange' : 'glass-card-layered'}`}
                >
                  <div className={`absolute top-0 left-0 w-[4px] h-full ${isOrange ? 'bg-orange-accent' : 'bg-cyan-accent'}`}></div>
                  <div className={`absolute right-4 top-4 ${isOrange ? 'text-orange-accent/20' : 'text-cyan-accent/20'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icons[idx % icons.length]} />
                    </svg>
                  </div>

                  <div className="space-y-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${isOrange ? 'bg-orange-accent/10 text-orange-accent' : 'bg-cyan-accent/10 text-cyan-accent'}`}>
                      {achievement.title}
                    </span>
                    <h4 className="text-xl font-bold uppercase tracking-wide text-white">{achievement.heading}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.footer && (
                    <div className="mt-6 border-t border-white/5 pt-4 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      {achievement.footer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Competency & Timeline Highlights */}
          <div className="pt-8 grid gap-8 grid-cols-1 md:grid-cols-2 relative z-10">
            <div>
              <h4 className="text-lg font-extrabold uppercase tracking-wider text-white mb-4">Competency Blueprint</h4>
              <div className="space-y-3">
                {competencyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0d111a] px-4 py-3.5 hover:border-cyan-accent/30 transition-all duration-300">
                    <div className="h-2.5 w-2.5 rounded-full bg-cyan-accent shadow-sm shadow-cyan-accent"></div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-200">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-extrabold uppercase tracking-wider text-white mb-4">Elite Training History</h4>
              <div className="border-l-2 border-cyan-accent/20 pl-6 space-y-6 py-2">
                {trainingHistory.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#06070a] border-2 border-cyan-accent">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-accent"></div>
                    </div>
                    <div>
                      {item.title && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-accent">{item.title}</span>
                      )}
                      <h5 className="text-sm font-bold text-white uppercase">{item.heading}</h5>
                      <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Career Highlights Horizontal Interactive Timeline */}
        {timelineData.length > 0 && (
        <section id="timeline" className="py-20 border-b border-white/5 relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Milestones</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-white uppercase md:text-4xl">
              Career Highlights
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-400 uppercase tracking-widest">
              An interactive roadmap of Tuwin&apos;s professional squash journey.
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            {/* Timeline Horizontal Line and Dots */}
            <div className="relative mb-12 flex items-center justify-between">
              {/* Connecting Line */}
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>
              <div
                className="absolute left-0 top-1/2 h-[2px] bg-gradient-to-r from-cyan-accent to-orange-accent -translate-y-1/2 z-0 transition-all duration-500 ease-out"
                style={{ width: `${(selectedYearIndex / (timelineData.length - 1)) * 100}%` }}
              ></div>

              {timelineData.map((item, idx) => {
                const isActive = idx === selectedYearIndex;
                const isVisited = idx < selectedYearIndex;
                return (
                  <button
                    key={item.year}
                    onClick={() => setSelectedYearIndex(idx)}
                    className="relative z-10 flex flex-col items-center group focus:outline-none cursor-pointer"
                  >
                    {/* Node Dot */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                        ? 'bg-[#06070a] border-cyan-accent scale-110 shadow-lg shadow-cyan-accent/20'
                        : isVisited
                          ? 'bg-cyan-accent/10 border-cyan-accent/60 hover:border-cyan-accent'
                          : 'bg-[#06070a] border-white/20 hover:border-white/50'
                        }`}
                    >
                      <span className={`text-xs font-black transition-colors ${isActive ? 'text-cyan-accent font-black' : 'text-slate-400 group-hover:text-white'
                        }`}>
                        {item.year.substring(2)}
                      </span>

                      {/* Active Pulse Ring */}
                      {isActive && (
                        <span className="absolute -inset-1 rounded-full border border-cyan-accent/40 animate-ping opacity-75"></span>
                      )}
                    </div>
                    {/* Year Label */}
                    <span
                      className={`mt-2 text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-cyan-accent' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                    >
                      {item.year}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Highlight Detail Card */}
            <div className="relative overflow-hidden">
              <div className="glass-card-layered p-8 border border-cyan-accent/20 bg-gradient-to-br from-cyan-accent/5 via-[#0d111a] to-transparent rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-[1.01]">
                <div className="absolute right-6 top-4 text-7xl font-black text-white/5 select-none pointer-events-none">
                  {timelineData[selectedYearIndex].year}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="rounded-full bg-cyan-accent/10 p-3 text-cyan-accent ring-1 ring-cyan-accent/30 text-2xl">
                    {timelineData[selectedYearIndex].icon}
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-cyan-accent/10 text-cyan-accent px-3.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest mb-1">
                      {timelineData[selectedYearIndex].tag}
                    </span>
                    <h4 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                      {timelineData[selectedYearIndex].title}
                    </h4>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  {timelineData[selectedYearIndex].description}
                </p>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* 5. Sponsors Section */}
        <section id="partners" className="py-24 border-b border-white/5 text-center px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-12">
              Powered By The Best
            </h2>

            {sponsors.length > 0 && (
              <div className="relative w-full overflow-hidden py-4">
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
            )}
          </div>
        </section>

        {/* 6. Contact Section */}
        <section id="contact" className="py-24 border-b border-white/5 space-y-16">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">

            {/* Contact Details Card */}
            <div className="flex-1 glass-card-layered p-8 space-y-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>

              <div className="z-10 relative">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Get In Touch</p>
                <h3 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                  Let&apos;s Connect
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">
                  Open for sponsorships, brand ambassadorships, elite coaching exchanges, and media inquiries. Let&apos;s push squash boundary limits together.
                </p>
              </div>

              <div className="space-y-4 z-10 relative">
                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-cyan-accent/10 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Locations</div>
                    <div className="text-sm text-slate-200 font-semibold">{contact.locations}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-cyan-accent/10 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Email Address</div>
                    <a href={`mailto:${contact.email}`} className="text-sm text-slate-200 hover:text-cyan-accent transition-colors font-semibold">
                      {contact.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-cyan-accent/10 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Phone Numbers</div>
                    <div className="text-sm text-slate-200 font-semibold">
                      {contact.phoneNumbers.map((phone, idx) => (
                        <React.Fragment key={phone}>
                          {idx > 0 && <span className="mx-2 text-slate-600">/</span>}
                          <a href={`tel:${phone}`} className="hover:text-cyan-accent transition-colors">{phone}</a>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* References note */}
              <div className="border-t border-white/5 pt-4 text-xs text-slate-400 italic z-10 relative">
                * References available upon request (CrossFit Ceylon Directors).
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="flex-1 glass-card-layered p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>

              <form className="space-y-4 z-10 relative" onSubmit={handleInquirySubmit}>
                <div>
                  <label htmlFor="name" className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#06070a] px-4 py-3 text-sm text-white focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent focus:outline-none transition-all duration-300"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#06070a] px-4 py-3 text-sm text-white focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent focus:outline-none transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                    Message Details
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#06070a] px-4 py-3 text-sm text-white focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Specify sponsorship, coaching, or press details..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={inquiryStatus === 'sending'}
                  className="w-full items-center justify-center rounded-full bg-orange-accent py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-orange-600 transition-colors duration-300 shadow-md shadow-orange-accent/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {inquiryStatus === 'sending' ? 'Sending...' : 'Send Inquiry'}
                </button>

                {inquiryStatus === 'success' && (
                  <p className="text-center text-xs font-semibold uppercase tracking-widest text-cyan-accent">
                    Inquiry sent successfully. Thank you!
                  </p>
                )}
                {inquiryStatus === 'error' && (
                  <p className="text-center text-xs font-semibold uppercase tracking-widest text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#06070a] py-12 relative z-10">
        <div className="mx-auto w-full max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-base font-bold uppercase tracking-widest text-white">
              {bioFirstName} <span className="text-cyan-accent">{bioLastName}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
              Professional Squash Athlete Portfolio
            </p>
            <div className="flex gap-4 mt-3">
              <a href="https://www.instagram.com/tuwin.herath?igsh=MjZmNG84NDF5dGdn
" className="p-2 bg-white/5 rounded-full text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04 1.23.328 1.97.772 2.392A3.9 3.9 0 0 0 1.417 14.6c.51.198 1.09.333 1.942.372C5.555 14.99 5.827 15 8.001 15s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.42.773-1.16.772-2.392.04-.852.048-1.124.048-3.297 0-2.174-.01-2.446-.048-3.297-.04-1.23-.328-1.97-.772-2.392a3.9 3.9 0 0 0-1.417-.923c-.51-.198-1.09-.333-1.942-.372C10.443.01 10.172 0 7.999 0zm-.08 1.44h.08c2.113 0 2.36.007 3.194.045.765.035 1.18.164 1.457.272.369.144.632.316.91.593s.45.541.592.91c.108.277.237.692.272 1.457.038.834.045 1.077.045 3.193v.08c0 2.113-.007 2.36-.045 3.194-.035.765-.164 1.18-.272 1.457a3.9 3.9 0 0 1-.91.593c-.277.108-.692.237-1.457.272-.834.038-1.077.045-3.193.045h-.08c-2.113 0-2.36-.007-3.194-.045-.765-.035-1.18-.164-1.457-.272a3.9 3.9 0 0 1-.91-.593c-.277-.108-.692-.237-1.457-.272-.834-.038-1.077-.045-3.193-.045h-.08c-2.113 0-2.36.007-3.194.045-.765.035-1.18.164-1.457.272-.369.144-.632.316-.91.593s-.45.541-.592.91c-.108.277-.237.692-.272 1.457-.038.834-.045 1.077-.045 3.193v.08c0 2.113.007 2.36.045 3.194.035.765.164 1.18.272 1.457.144.369.316.632.593.91s.541.45.91.592c.277.108.692.237 1.457.272.834.038 1.077.045 3.193.045zm0 2.456a3.906 3.906 0 1 0 0 7.812 3.906 3.906 0 0 0 0-7.812m0 5.837a1.931 1.931 0 1 1 0-3.862 1.931 1.931 0 0 1 0 3.862m4.93-4.831a1.156 1.156 0 1 1-2.31 0 1.156 1.156 0 0 1 2.31 0" />
                </svg>
              </a>
              <a href="mailto:tuwinosanda@gmail.com" className="p-2 bg-white/5 rounded-full text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
              </a>
            </div>
            <p className="text-[10px] text-slate-500 mt-3">
              Designed with precision, focus, and clean athletic style.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-xs text-slate-400 md:text-right">
            <p>© {new Date().getFullYear()} {bio.name}. Designed &amp; Developed by Zerone.</p>
            <p className="text-cyan-accent text-[10px] uppercase tracking-widest font-bold">
              ADEL &amp; WADA Certified Competitor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
