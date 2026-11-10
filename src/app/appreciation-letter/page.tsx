import type { Metadata } from 'next';
import Link from 'next/link';
import PdfViewer from './PdfViewer';

export const metadata: Metadata = {
  title: 'Official Appreciation Letter | Tuwin Herath',
  description: 'The original Sri Lanka Squash appreciation letter recognizing Tuwin Herath\'s coordination of the Winged Falcon partnership.',
};

export default function AppreciationLetterPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b12]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/#bio"
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-accent transition-colors hover:border-cyan-accent/40"
            aria-label="Return to the portfolio"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-accent">Official Recognition</p>
            <h1 className="mt-1 text-sm font-extrabold uppercase tracking-wide sm:text-base">Sri Lanka Squash Appreciation Letter</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-2xl border border-cyan-accent/15 bg-cyan-accent/5 p-4 text-xs leading-relaxed text-slate-300 sm:p-5 sm:text-sm">
          Issued on 2 November 2026 by Group Captain Eranda Geeganage, President of Sri Lanka Squash, recognizing the coordination of Winged Falcon as the Official Racket Sponsor of the Colombo Junior Squash Championship 2026.
        </div>

        <PdfViewer fileUrl="/colombo-junior-squash-championship-2026-appreciation.pdf" />
      </div>
    </main>
  );
}
