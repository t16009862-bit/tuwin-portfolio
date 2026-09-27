'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type MatchResult = 'Won' | 'Lost';

type Match = {
  date: string;
  tournament: string;
  round: string;
  opponent: string;
  score: string;
  games: string;
  result: MatchResult;
};

const MATCHES: Match[] = [
  { date: '2026-09-26', tournament: 'JSW 12th Sunil Verma Memorial Tournament 2026', round: 'Round 1', opponent: 'Hridhaan Kamalbhai Shah', score: '0–3', games: '3–11, 6–11, 3–11', result: 'Lost' },
  { date: '2026-09-07', tournament: 'KCC PSA Challenge Cup 2026', round: 'Round 1', opponent: 'Tay Jun Qian', score: '1–3', games: '11–9, 7–11, 3–11, 4–11', result: 'Lost' },
  { date: '2026-08-24', tournament: '2nd CAS International Squash 2026', round: 'Round 1', opponent: 'Shota Yasunari', score: '0–3', games: '5–11, 4–11, 5–11', result: 'Lost' },
  { date: '2026-06-24', tournament: 'Greetings Squash PSA Challenger 2026', round: 'Round of 16', opponent: 'Wailok To', score: '0–3', games: '8–11, 3–11, 5–11', result: 'Lost' },
  { date: '2025-10-24', tournament: 'China Squash Tour 2025 S3', round: 'Round of 16', opponent: 'Tsun Hei Mak', score: '1–3', games: '11–7, 7–11, 9–11, 6–11', result: 'Lost' },
  { date: '2025-09-27', tournament: 'HCL Squash Indian Tour 3, Bengaluru 2025', round: 'Round of 16', opponent: 'Suraj Kumar Chand', score: '0–3', games: '8–11, 9–11, 6–11', result: 'Lost' },
  { date: '2025-09-26', tournament: 'HCL Squash Indian Tour 3, Bengaluru 2025', round: 'Round of 32', opponent: 'Divit Poojary', score: '3–0', games: '11–3, 11–4, 11–4', result: 'Won' },
  { date: '2025-09-17', tournament: 'Reliance PSA Challenger Championship 2025', round: 'Round of 32', opponent: 'Mostafa Mekki', score: '1–3', games: '12–14, 11–3, 9–11, 4–11', result: 'Lost' },
  { date: '2025-05-30', tournament: 'Northern Star Resources Ltd Golden Open 2025', round: 'Quarter-Final', opponent: 'Ravindu Laksiri', score: '0–3', games: '3–11, 2–11, 3–11', result: 'Lost' },
  { date: '2025-05-30', tournament: 'Northern Star Resources Ltd Golden Open 2025', round: 'Round 1', opponent: 'Naoki Hayashi', score: '3–2', games: '12–10, 11–2, 4–11, 7–11, 11–7', result: 'Won' },
  { date: '2025-05-23', tournament: 'Auckland Open PSA Challenger 2025', round: 'Round 2', opponent: 'Freddie Jameson', score: '0–3', games: '5–11, 3–11, 7–11', result: 'Lost' },
  { date: '2025-05-09', tournament: 'NT Open 2025', round: 'Round 2', opponent: 'Shamil Wakeel', score: '0–3', games: '4–11, 3–11, 4–11', result: 'Lost' },
  { date: '2025-05-08', tournament: 'NT Open 2025', round: 'Round 1', opponent: 'Darcy Hayes', score: '3–2', games: '11–6, 6–11, 11–5, 5–11, 11–6', result: 'Won' },
  { date: '2024-12-18', tournament: '79 CCI Western India 2024', round: 'Round 1', opponent: 'Rahul Baitha', score: '0–3', games: '3–11, 8–11, 7–11', result: 'Lost' },
  { date: '2024-11-15', tournament: 'Bondi Open 2024', round: 'Quarter-Final', opponent: 'Oliver Dunbar', score: '0–3', games: '2–11, 4–11, 4–11', result: 'Lost' },
  { date: '2024-11-14', tournament: 'Bondi Open 2024', round: 'Round 2', opponent: "Gianluca Bushell-O'Connor", score: '3–2', games: '3–11, 7–11, 14–12, 11–7, 11–4', result: 'Won' },
  { date: '2024-11-06', tournament: 'Alto Pennant Hills NSW Open 2024', round: 'Round 1', opponent: 'Kasper Cheung', score: '1–3', games: '9–11, 11–4, 6–11, 14–16', result: 'Lost' },
  { date: '2024-08-28', tournament: 'HCL Squash Tour – Kolkata 2024', round: 'Round 2', opponent: 'Vedant Patel', score: '0–3', games: '2–11, 9–11, 9–11', result: 'Lost' },
  { date: '2024-08-27', tournament: 'HCL Squash Tour – Kolkata 2024', round: 'Round 1', opponent: 'Rounak Yadav', score: '3–0', games: '11–9, 11–9, 11–3', result: 'Won' },
  { date: '2024-08-16', tournament: 'Reliance PSA Challenge 3 Tournament 2024', round: 'Quarter-Final', opponent: 'Ravindu Laksiri', score: '0–3', games: '3–11, 2–11, 3–11', result: 'Lost' },
  { date: '2024-08-15', tournament: 'Reliance PSA Challenge 3 Tournament 2024', round: 'Round 2', opponent: 'Sepehr Etemadpoor', score: 'W/O', games: 'Walkover', result: 'Won' },
  { date: '2024-08-15', tournament: 'Reliance PSA Challenge 3 Tournament 2024', round: 'Round 1', opponent: 'Ilham Asmone', score: '3–1', games: '6–11, 11–5, 11–3, 11–3', result: 'Won' },
];

const COUNTING_POINTS = [
  { date: '2026-08-31', tournament: '2nd CAS International Squash 2026', result: 'Round of 32', points: 22, expires: '2027-08-30' },
  { date: '2026-06-29', tournament: 'Greetings Squash PSA Challenger 2026', result: 'Round of 16', points: 18, expires: '2027-06-28' },
  { date: '2025-10-06', tournament: 'HCL Squash Indian Tour 3, Bengaluru 2025', result: 'Round of 16', points: 18, expires: '2026-10-05' },
  { date: '2025-12-27', tournament: '45th Senior Nationals (Sri Lanka) Squash Championship 2025', result: 'Round of 16', points: 15, expires: '2026-12-26' },
  { date: '2025-12-03', tournament: 'China Squash Tour 2025 S5', result: 'Semi-finalist', points: 12, expires: '2026-12-02' },
  { date: '2026-09-14', tournament: 'KCC PSA Challenge Cup 2026', result: 'Round of 32', points: 11, expires: '2027-09-13' },
  { date: '2025-10-27', tournament: 'China Squash Tour 2025 S3', result: 'Round of 16', points: 9, expires: '2026-10-26' },
  { date: '2025-11-22', tournament: 'China Squash Tour 2025 S4', result: 'Quarter-finalist', points: 7.5, expires: '2026-11-21' },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MatchHistoryPage() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [result, setResult] = useState<'all' | MatchResult>('all');

  const filteredMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MATCHES.filter((match) => {
      const matchesQuery = !normalizedQuery || `${match.opponent} ${match.tournament} ${match.round}`.toLowerCase().includes(normalizedQuery);
      const matchesYear = year === 'all' || match.date.startsWith(year);
      const matchesResult = result === 'all' || match.result === result;
      return matchesQuery && matchesYear && matchesResult;
    });
  }, [query, result, year]);

  const wins = MATCHES.filter((match) => match.result === 'Won').length;
  const losses = MATCHES.length - wins;
  const uniqueOpponents = new Set(MATCHES.map((match) => match.opponent)).size;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06070a] text-white selection:bg-cyan-accent selection:text-black">
      <div className="aurora-bg" />
      <div className="absolute inset-0 z-0 grid-overlay opacity-[0.15] pointer-events-none" />
      <div className="wave-contour-pattern" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold uppercase tracking-widest text-white transition-colors hover:text-cyan-accent">
            Tuwin <span className="font-extrabold text-gradient-cyan-solid">Herath</span>
          </Link>
          <Link href="/#career" className="rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest text-cyan-accent transition-all hover:bg-cyan-accent hover:text-black">
            ← Back to rankings
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
        <section className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent">Official PSA record</p>
          <h1 className="text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Match <span className="text-gradient-cyan-solid">history</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Opponents, tournament rounds, match scores and the official ranking-points breakdown recorded by PSA.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="PSA career summary">
          {[
            ['World ranking', '#445'],
            ['Highest ranking', '#316'],
            ['Official matches', MATCHES.length.toString()],
            ['Wins / losses', `${wins} / ${losses}`],
            ['Opponents', uniqueOpponents.toString()],
          ].map(([label, value], index) => (
            <div key={label} className={`p-5 ${index === 0 ? 'glass-card-layered-orange' : 'glass-card-layered'}`}>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className={`mt-2 text-2xl font-black ${index === 0 ? 'text-orange-accent' : 'text-white'}`}>{value}</p>
            </div>
          ))}
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">Published 21 Sep 2026</p>
              <h2 className="mt-2 text-2xl font-extrabold uppercase">Official points breakdown</h2>
            </div>
            <Link href="/rankings/points-calculator" className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-accent hover:text-white">
              Open calculator →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-5">
            {[
              ['Total points', '112.50'],
              ['Counting points', '112.50'],
              ['Average', '10.23'],
              ['Events played', '8'],
              ['Divisor', '11'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
            <table className="min-w-[820px] w-full text-sm">
              <thead className="bg-white/[0.035] text-[10px] uppercase tracking-widest text-slate-500">
                <tr><th className="px-4 py-3 text-left">Ranking date</th><th className="px-4 py-3 text-left">Tournament</th><th className="px-4 py-3 text-left">Result</th><th className="px-4 py-3 text-right">Points</th><th className="px-4 py-3 text-right">Expires</th></tr>
              </thead>
              <tbody>
                {COUNTING_POINTS.map((entry) => (
                  <tr key={`${entry.date}-${entry.tournament}`} className="border-t border-white/5 text-slate-300">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(entry.date)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{entry.tournament}</td>
                    <td className="px-4 py-3">{entry.result}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-cyan-accent">{entry.points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{formatDate(entry.expires)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            PSA divides the 112.50 counting points by the full divisor of 11, including the empty counting places. A non-counting medical zero for China Squash Tour Challenger #1 2026 is recorded separately and is not included above.
          </p>
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">PSA match log</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">Previous opponents</h2>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_150px_150px]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opponent or tournament"
              aria-label="Search match history"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-accent/70"
            />
            <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Filter by year" className="rounded-xl border border-white/10 bg-[#0d111a] px-4 py-3 text-sm text-white outline-none focus:border-cyan-accent/70">
              <option value="all">All years</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option>
            </select>
            <select value={result} onChange={(event) => setResult(event.target.value as 'all' | MatchResult)} aria-label="Filter by result" className="rounded-xl border border-white/10 bg-[#0d111a] px-4 py-3 text-sm text-white outline-none focus:border-cyan-accent/70">
              <option value="all">All results</option><option value="Won">Won</option><option value="Lost">Lost</option>
            </select>
          </div>

          <p className="mt-4 text-xs text-slate-500">Showing {filteredMatches.length} of {MATCHES.length} official matches</p>

          <div className="mt-4 space-y-3">
            {filteredMatches.map((match) => (
              <article key={`${match.date}-${match.tournament}-${match.opponent}`} className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-5 md:grid-cols-[115px_minmax(0,1fr)_minmax(0,0.8fr)_110px] md:items-center">
                <div>
                  <p className="text-xs font-bold text-white">{formatDate(match.date)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{match.round}</p>
                </div>
                <div>
                  <p className="font-extrabold text-white">{match.opponent}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{match.tournament}</p>
                </div>
                <div>
                  <p className="font-black text-white">{match.score}</p>
                  <p className="mt-1 text-xs text-slate-500">{match.games}</p>
                </div>
                <span className={`justify-self-start rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest md:justify-self-end ${match.result === 'Won' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                  {match.result}
                </span>
              </article>
            ))}
            {filteredMatches.length === 0 && <p className="rounded-2xl border border-white/5 p-8 text-center text-sm text-slate-500">No matches found for those filters.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-orange-accent/15 bg-orange-accent/5 p-6 text-sm leading-relaxed text-slate-400">
          The Indian Challenger 9 result is worth 16.5 points but is not yet part of the official 21 September ranking breakdown. It should appear in the first published Monday ranking after the tournament is completed. The official PSA record remains authoritative.
        </section>
      </main>
    </div>
  );
}
