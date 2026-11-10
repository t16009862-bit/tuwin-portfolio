import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sri Lanka Squash Appreciation Letter | Tuwin Herath',
  description: 'Official appreciation from Sri Lanka Squash for coordinating the Winged Falcon partnership for the Colombo Junior Squash Championship 2026.',
};

const pages = Array.from({ length: 5 }, (_, index) => index + 1);

export default function AppreciationLetterPage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#070b12]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
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

          <a
            href="/colombo-junior-squash-championship-2026-appreciation.pdf"
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-accent px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition-colors hover:bg-cyan-300"
          >
            Download Original PDF
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 rounded-2xl border border-cyan-accent/15 bg-cyan-accent/5 p-5 text-sm leading-relaxed text-slate-300">
          Issued on 2 November 2026 by Group Captain Eranda Geeganage, President of Sri Lanka Squash, in recognition of Tuwin Herath&apos;s coordination of Winged Falcon as the Official Racket Sponsor of the Colombo Junior Squash Championship 2026.
        </div>

        <div className="space-y-8">
          {pages.map((page) => (
            <figure key={page} className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-black/40">
              <Image
                src={`/appreciation-letter/page-${page}.jpg`}
                alt={`Sri Lanka Squash appreciation letter, page ${page} of 5`}
                width={1105}
                height={1430}
                sizes="(max-width: 1024px) 100vw, 960px"
                priority={page === 1}
                className="h-auto w-full"
              />
              <figcaption className="sr-only">Page {page} of 5</figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/#bio"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-cyan-accent/40 hover:text-cyan-accent"
          >
            Return to Tuwin&apos;s Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
