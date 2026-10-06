'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Package {
  tierName: string;
  title: string;
  price: string;
  benefits: string[];
  images: string[];
}

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (!trimmed) return trimmed;
  return /usd/i.test(trimmed) ? trimmed : `USD ${trimmed}`;
}

export default function Packages() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [selectedTier, setSelectedTier] = useState('');
  const [customPackage, setCustomPackage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contact, setContact] = useState({
    locations: 'Malabe, Sri Lanka / Shanghai, China',
    email: 'tuwinosanda@gmail.com',
    phoneNumbers: ['+94771182429', '+8613002144061'],
  });

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
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/packages')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load packages');
        return res.json();
      })
      .then((data: { packages: Package[] }) => {
        if (!cancelled) setPackages(data.packages);
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

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInquiryStatus('sending');

    const packageLabel = selectedTier === 'Custom' ? (customPackage || 'Custom') : selectedTier;
    const composedMessage = packageLabel
      ? `Package Interest: ${packageLabel}\n\n${inquiryForm.message}`
      : inquiryForm.message;

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiryForm, message: composedMessage }),
      });
      if (!res.ok) throw new Error('Request failed');
      setInquiryStatus('success');
      setInquiryForm({ name: '', email: '', message: '' });
      setSelectedTier('');
      setCustomPackage('');
    } catch {
      setInquiryStatus('error');
    }
  };

  const selectedPackageDetail = packages.find((pkg) => pkg.tierName === selectedTier);

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
            href="#inquiry-form"
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
              href="#inquiry-form"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-cyan-accent bg-cyan-accent/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 space-y-16">

        {/* Title Header */}
        <div className="text-center md:text-left py-6 relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Become A Sponsor</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
            SPONSORSHIP <span className="text-gradient-cyan-solid">PACKAGES</span>
          </h1>
          <div className="mt-4 h-[3px] w-24 bg-[#00E5FF] rounded-full"></div>
          <p className="mt-6 max-w-2xl text-sm text-slate-400 leading-relaxed mx-auto md:mx-0">
            Choose the partnership tier that fits your brand, or reach out for a custom arrangement built around your goals.
          </p>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-400 uppercase tracking-widest font-bold">
            Loading packages…
          </div>
        ) : loadError ? (
          <div className="py-20 text-center text-sm text-orange-accent uppercase tracking-widest font-bold">
            Unable to load packages right now. Please try again later.
          </div>
        ) : packages.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-400 uppercase tracking-widest font-bold">
            No packages available yet.
          </div>
        ) : (
          <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {packages.map((pkg, idx) => {
              const isOrange = idx % 2 === 1;
              return (
                <div
                  key={pkg.tierName}
                  className={`p-8 relative overflow-hidden flex flex-col justify-between group ${isOrange ? 'glass-card-layered-orange' : 'glass-card-layered'}`}
                >
                  <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${isOrange ? 'via-orange-accent/50' : 'via-cyan-accent/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 opacity-[0.03] wave-contour-pattern pointer-events-none"></div>

                  <div className="space-y-4 relative z-10">
                    <span className={`inline-block rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${isOrange ? 'bg-orange-accent/10 text-orange-accent' : 'bg-cyan-accent/10 text-cyan-accent'}`}>
                      {pkg.tierName}
                    </span>
                    <h3 className="text-xl font-bold uppercase tracking-wide text-white">{pkg.title}</h3>
                    <p className={`text-3xl font-extrabold tracking-tight ${isOrange ? 'text-orange-accent text-gradient-orange' : 'text-cyan-accent text-gradient-cyan-solid'}`}>
                      {formatPrice(pkg.price)}
                    </p>

                    {pkg.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {pkg.images.map((src, imgIdx) => (
                          <div key={imgIdx} className="relative h-16 w-16 rounded-lg overflow-hidden">
                            <Image
                              src={src}
                              alt={`${pkg.tierName} package image ${imgIdx + 1}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {pkg.benefits.length > 0 && (
                      <ul className="space-y-2 pt-2">
                        {pkg.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-sm text-slate-300">
                            <svg
                              className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isOrange ? 'text-orange-accent' : 'text-cyan-accent'}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTier(pkg.tierName);
                      document.getElementById('package-details')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer relative z-10 ${isOrange
                        ? 'bg-orange-accent text-white hover:bg-orange-600 shadow-md hover:shadow-orange-accent/25'
                        : 'bg-cyan-accent text-black hover:bg-cyan-300 shadow-md hover:shadow-cyan-accent/25'
                      }`}
                  >
                    Select {pkg.tierName}
                  </button>
                </div>
              );
            })}
          </section>
        )}

        {/* Selected Package Details */}
        {selectedPackageDetail && (
          <section id="package-details" className="relative z-10 py-4">
            <div className="glass-card-layered p-8 md:p-12 relative overflow-hidden border border-cyan-accent/20">
              <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>

              <div className="relative z-10 space-y-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-cyan-accent/10 text-cyan-accent px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest mb-3">
                      {selectedPackageDetail.tierName}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                      {selectedPackageDetail.title}
                    </h2>
                  </div>
                  <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-accent text-gradient-cyan-solid">
                    {formatPrice(selectedPackageDetail.price)}
                  </p>
                </div>

                {selectedPackageDetail.images.length > 0 && (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {selectedPackageDetail.images.map((src, imgIdx) => (
                      <div key={imgIdx} className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                        <Image
                          src={src}
                          alt={`${selectedPackageDetail.tierName} package image ${imgIdx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedPackageDetail.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Benefits</h3>
                    <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {selectedPackageDetail.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3 text-sm text-slate-200 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-cyan-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-accent px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-cyan-300 hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-cyan-accent/35 cursor-pointer"
                >
                  Continue To Inquiry
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Get In Touch Section */}
        <section id="packages-contact" className="py-12 border-t border-white/5 space-y-16">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
              Let&apos;s Talk Sponsorship
            </h2>
          </div>

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
            <div id="inquiry-form" className="scroll-mt-24 flex-1 glass-card-layered p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>

              <form className="space-y-4 z-10 relative" onSubmit={handleInquirySubmit}>
                <div>
                  <label htmlFor="tier" className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                    Select Package
                  </label>
                  <select
                    id="tier"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#06070a] px-4 py-3 text-sm text-white focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent focus:outline-none transition-all duration-300"
                  >
                    <option value="">Select a package (optional)</option>
                    {packages.map((pkg) => (
                      <option key={pkg.tierName} value={pkg.tierName}>{pkg.tierName} — {pkg.title}</option>
                    ))}
                    <option value="Custom">Custom Package</option>
                  </select>
                </div>

                {selectedTier === 'Custom' && (
                  <div>
                    <label htmlFor="customPackage" className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                      Describe Your Custom Package
                    </label>
                    <input
                      type="text"
                      id="customPackage"
                      value={customPackage}
                      onChange={(e) => setCustomPackage(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#06070a] px-4 py-3 text-sm text-white focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent focus:outline-none transition-all duration-300"
                      placeholder="e.g. Regional apparel partnership"
                    />
                  </div>
                )}

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
              <a href="mailto:tuwinosanda@gmail.com" className="p-2
               bg-white/5 rounded-full text-cyan-accent hover:bg-cyan-accent hover:text-black transition-all">
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
