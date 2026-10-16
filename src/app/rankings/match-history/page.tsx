'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  CURRENT_COUNTING_POINTS,
  DEFAULT_RANKING_SUMMARY,
  EXPIRED_POINTS,
  MATCHES,
  MEDICAL_ZEROS,
  NO_PENALTY_WITHDRAWALS,
  PENDING_POINTS,
  RANKING_ZEROS,
  type Match,
  type MatchResult,
  type MedicalZero,
  type NoPenaltyWithdrawal,
  type PointsEntry,
  type RankingSummary,
  type RankingZero,
} from './data';

function formatDate(date: string) {
  if (!date) return 'Pending';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

type TournamentPointRow = PointsEntry & { status: 'Current' | 'Expired' | 'Pending' };

type RankingRecordsResponse = {
  summary: RankingSummary;
  tournamentPoints: TournamentPointRow[];
  medicalZeros: MedicalZero[];
  rankingZeros: RankingZero[];
  withdrawals: Array<NoPenaltyWithdrawal & { status?: string }>;
  matches: Match[];
};

function PointsTable({ entries, expiryLabel = 'Expires' }: { entries: PointsEntry[]; expiryLabel?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5">
      <table className="min-w-[860px] w-full text-sm">
        <thead className="bg-white/[0.035] text-[10px] uppercase tracking-widest text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Points date</th>
            <th className="px-4 py-3 text-left">Tournament</th>
            <th className="px-4 py-3 text-left">Result</th>
            <th className="px-4 py-3 text-right">Points</th>
            <th className="px-4 py-3 text-right">{expiryLabel}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.date}-${entry.tournament}`} className="border-t border-white/5 text-slate-300">
              <td className="whitespace-nowrap px-4 py-3">{formatDate(entry.date)}</td>
              <td className="px-4 py-3 font-semibold text-white">{entry.tournament}</td>
              <td className="px-4 py-3">{entry.result}</td>
              <td className="px-4 py-3 text-right font-extrabold text-cyan-accent">{entry.points.toFixed(2)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">{formatDate(entry.expires)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MatchHistoryPage() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [result, setResult] = useState<'all' | MatchResult>('all');
  const [summary, setSummary] = useState(DEFAULT_RANKING_SUMMARY);
  const [currentPoints, setCurrentPoints] = useState(CURRENT_COUNTING_POINTS);
  const [expiredPoints, setExpiredPoints] = useState(EXPIRED_POINTS);
  const [pendingPoints, setPendingPoints] = useState(PENDING_POINTS);
  const [medicalZeros, setMedicalZeros] = useState(MEDICAL_ZEROS);
  const [rankingZeros, setRankingZeros] = useState(RANKING_ZEROS);
  const [withdrawals, setWithdrawals] = useState(NO_PENALTY_WITHDRAWALS);
  const [matches, setMatches] = useState(MATCHES);
  const [dataStatus, setDataStatus] = useState<'loading' | 'live' | 'fallback'>('loading');

  useEffect(() => {
    let cancelled = false;

    const loadRecords = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch('/api/ranking-records', { cache: 'no-store' });
          if (!response.ok) throw new Error('Ranking records are unavailable');
          const data = await response.json() as RankingRecordsResponse;
          if (cancelled) return;
          setSummary(data.summary);
          setCurrentPoints(data.tournamentPoints.filter((entry) => entry.status === 'Current'));
          setExpiredPoints(data.tournamentPoints.filter((entry) => entry.status === 'Expired'));
          setPendingPoints(data.tournamentPoints.filter((entry) => entry.status === 'Pending'));
          setMedicalZeros(data.medicalZeros);
          setRankingZeros(data.rankingZeros);
          setWithdrawals(data.withdrawals);
          setMatches(data.matches);
          setDataStatus('live');
          return;
        } catch {
          if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 700 * (attempt + 1)));
        }
      }
      if (!cancelled) setDataStatus('fallback');
    };

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return matches.filter((match) => {
      const matchesQuery = !normalizedQuery || `${match.opponent} ${match.tournament} ${match.round}`.toLowerCase().includes(normalizedQuery);
      const matchesYear = year === 'all' || match.year === year;
      const matchesResult = result === 'all' || match.result === result;
      return matchesQuery && matchesYear && matchesResult;
    });
  }, [matches, query, result, year]);

  const wins = matches.filter((match) => match.result === 'Won').length;
  const losses = matches.length - wins;
  const uniqueKnownOpponents = new Set(matches.filter((match) => match.opponent !== 'TBD').map((match) => match.opponent)).size;
  const years = [...new Set(matches.map((match) => match.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  const activeMedicalZeros = medicalZeros.filter((entry) => entry.status === 'Active').length;
  const medicalZeroClarifications = medicalZeros.filter((entry) => entry.reference || entry.rankingImpact);
  const activeRankingZeros = rankingZeros.filter((entry) => entry.status === 'Active').length;
  const average = summary.divisor > 0 ? summary.countingPoints / summary.divisor : 0;

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
          <Link href="/#rankings" className="rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest text-cyan-accent transition-all hover:bg-cyan-accent hover:text-black">
            ← Back to rankings
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
        <section className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent">Official PSA record</p>
          <h1 className="text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Rankings &amp; <span className="text-gradient-cyan-solid">match history</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            A read-only archive of official ranking points, expiries, tournament entries, opponents and match scores recorded by PSA.
          </p>
        </section>

        <section className="rounded-2xl border border-green-400/20 bg-green-400/[0.06] p-6" aria-label="Read-only notice">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-green-400">Read-only public record</p>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-300">
            Visitors cannot add, edit, delete or save anything on this page. The search and filters only change what is visible in that visitor&apos;s browser and reset when the page is refreshed.
          </p>
        </section>

        {dataStatus !== 'live' && (
          <section className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-100" aria-live="polite">
            {dataStatus === 'loading'
              ? 'Checking the latest ranking records…'
              : `Live records are temporarily unavailable. Showing the last verified snapshot from ${formatDate(summary.recordCheckedDate)}.`}
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="PSA career summary">
          {[
            ['World ranking', `#${summary.worldRanking}`],
            ['Highest ranking', `#${summary.highestRanking}`],
            ['Official matches', matches.length.toString()],
            ['Wins / losses', `${wins} / ${losses}`],
            ['Known opponents', uniqueKnownOpponents.toString()],
          ].map(([label, value], index) => (
            <div key={label} className={`p-5 ${index === 0 ? 'glass-card-layered-orange' : 'glass-card-layered'}`}>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className={`mt-2 text-2xl font-black ${index === 0 ? 'text-orange-accent' : 'text-white'}`}>{value}</p>
            </div>
          ))}
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">Published {formatDate(summary.publishedDate)}</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">How the current ranking is calculated</h2>
          </div>

          <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-5">
            {[
              ['Total points', summary.totalPoints.toFixed(2)],
              ['Counting points', summary.countingPoints.toFixed(2)],
              ['Average', average.toFixed(2)],
              ['PSA played', summary.played.toString()],
              ['Divisor', summary.divisor.toString()],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-accent/15 bg-cyan-accent/[0.045] p-5">
            <p className="text-sm font-extrabold text-white">{summary.countingPoints.toFixed(2)} points ÷ {summary.divisor} divisor = {average.toFixed(3)}… → {average.toFixed(2)} average</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              PSA shows {summary.played} played and a divisor of {summary.divisor}. The {currentPoints.length} positive-point results total {summary.countingPoints.toFixed(2)} points; the earlier China Medical Zero is temporarily treated as played, while {summary.emptyDivisorPlaces} empty places complete the divisor.
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-accent">Current</p>
                <h3 className="mt-1 text-lg font-extrabold uppercase">Positive-point tournaments</h3>
              </div>
              <span className="rounded-full bg-cyan-accent/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-accent">{currentPoints.length} events · {summary.countingPoints.toFixed(2)} points</span>
            </div>
            <PointsTable entries={currentPoints} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Empty divisor places</p>
              <p className="mt-2 text-3xl font-black text-white">{summary.emptyDivisorPlaces}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">Zero points each, used only to reach the divisor of {summary.divisor}.</p>
            </div>
            <div className="rounded-2xl border border-orange-accent/20 bg-orange-accent/[0.05] p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-accent">Active medical zeros</p>
              <p className="mt-2 text-3xl font-black text-white">{activeMedicalZeros}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">China and Astana are the two active Medical Zeros. PSA lists Astana inside its 11-place Counting Tournaments breakdown at 0.00 points. Because both fall within 52 weeks, PSA treats the earlier China Medical Zero as played for a maximum of 26 weeks.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Other ranking zeros</p>
              <p className="mt-2 text-3xl font-black text-white">{activeRankingZeros}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">No other zero penalty appears in the checked PSA breakdowns.</p>
            </div>
          </div>
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-accent">PSA zero-point records</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">Medical zeros</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              PSA includes active Medical Zeros as 0.00-point entries within its Counting Tournaments breakdown. They are expanded separately here only so the ruling, expiry and ranking treatment remain clear.
            </p>
          </div>
          {medicalZeroClarifications.map((entry) => (
            <div key={`${entry.tournament}-${entry.reference}`} className="mt-6 rounded-2xl border border-orange-accent/20 bg-orange-accent/[0.05] p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-accent/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-accent">PSA clarification</span>
                {entry.reference && <span className="text-xs font-bold text-white">Violation {entry.reference}</span>}
                {!entry.reference && entry.rankingImpact && <span className="text-xs font-bold text-white">Ranking treatment</span>}
              </div>
              <p className="mt-3 text-sm font-bold text-white">{entry.tournament}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {[entry.violation, entry.reason && `Reason: ${entry.reason}`, entry.ruling && `Ruling: ${entry.ruling}`].filter(Boolean).join(' · ')}
              </p>
              {entry.rankingImpact && <p className="mt-2 text-xs leading-relaxed text-slate-300">{entry.rankingImpact}</p>}
            </div>
          ))}
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-white/[0.035] text-[10px] uppercase tracking-widest text-slate-500">
                <tr><th className="px-4 py-3 text-left">Recorded</th><th className="px-4 py-3 text-left">Tournament</th><th className="px-4 py-3 text-left">PSA record</th><th className="px-4 py-3 text-right">Points</th><th className="px-4 py-3 text-right">Expires / expired</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {medicalZeros.map((entry) => (
                  <tr key={entry.tournament} className="border-t border-white/5 text-slate-300">
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(entry.date)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{entry.tournament}</td>
                    <td className="max-w-[320px] px-4 py-3 text-xs leading-relaxed text-slate-400">
                      {entry.reference ? <><span className="font-bold text-orange-accent">{entry.reference}</span> · {entry.violation}<br />{entry.ruling}</> : 'Medical Zero'}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-orange-accent">0.00</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">{formatDate(entry.expires)}</td>
                    <td className="px-4 py-3 text-right"><span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${entry.status === 'Active' ? 'bg-orange-accent/10 text-orange-accent' : 'bg-white/5 text-slate-500'}`}>{entry.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Kept separate</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">Other ranking zeros</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              Any non-medical zero recorded by PSA appears here. Empty divisor places are not events and remain in the calculation summary above.
            </p>
          </div>
          {rankingZeros.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-white/5 bg-white/[0.025] p-6 text-sm text-slate-500">No other ranking-zero entries are recorded.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
              <table className="min-w-[780px] w-full text-sm">
                <thead className="bg-white/[0.035] text-[10px] uppercase tracking-widest text-slate-500">
                  <tr><th className="px-4 py-3 text-left">Recorded</th><th className="px-4 py-3 text-left">Tournament</th><th className="px-4 py-3 text-left">Reason</th><th className="px-4 py-3 text-right">Expires / expired</th><th className="px-4 py-3 text-right">Status</th></tr>
                </thead>
                <tbody>
                  {rankingZeros.map((entry) => (
                    <tr key={`${entry.date}-${entry.tournament}`} className="border-t border-white/5 text-slate-300">
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(entry.date)}</td>
                      <td className="px-4 py-3 font-semibold text-white">{entry.tournament}</td>
                      <td className="px-4 py-3">{entry.reason}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">{formatDate(entry.expires)}</td>
                      <td className="px-4 py-3 text-right">{entry.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">Historical archive</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">Expired tournament points</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              All earlier point-bearing tournaments found in the checked PSA ranking publications, including the points and the date each result expired.
            </p>
          </div>
          <div className="mt-6">
            <PointsTable entries={expiredPoints} expiryLabel="Expired" />
          </div>
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Not ranking zeros</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">No-penalty withdrawals</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              PSA records these entries as withdrawn with “No penalty”. PSA confirmed on 13 Oct 2026 that PSNS 3K Challenger remains No Penalty under Section 4.7.3 because it continues the Astana injury; it is not a separate third Medical Zero. These entries add no points, have no points-expiry date, and are not medical or disciplinary zeros.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-white/[0.035] text-[10px] uppercase tracking-widest text-slate-500">
                <tr><th className="px-4 py-3 text-left">Tournament dates</th><th className="px-4 py-3 text-left">Tournament</th><th className="px-4 py-3 text-left">PSA ruling</th><th className="px-4 py-3 text-right">PSA status</th></tr>
              </thead>
              <tbody>
                {withdrawals.map((entry) => (
                  <tr key={`${entry.startDate}-${entry.tournament}`} className="border-t border-white/5 text-slate-300">
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(entry.startDate)} – {formatDate(entry.endDate)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{entry.tournament}</td>
                    <td className="max-w-[340px] px-4 py-3 text-xs leading-relaxed text-slate-400">{entry.ruling || entry.reason || 'No penalty'}</td>
                    <td className="px-4 py-3 text-right"><span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Withdrawn · No penalty</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">Complete PSA match log</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase">Previous opponents</h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">View-only filters. Nothing typed or selected here is saved, and no website data is changed.</p>
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
              <option value="all">All years</option>
              {years.map((matchYear) => <option key={matchYear} value={matchYear}>{matchYear}</option>)}
            </select>
            <select value={result} onChange={(event) => setResult(event.target.value as 'all' | MatchResult)} aria-label="Filter by result" className="rounded-xl border border-white/10 bg-[#0d111a] px-4 py-3 text-sm text-white outline-none focus:border-cyan-accent/70">
              <option value="all">All results</option><option value="Won">Won</option><option value="Lost">Lost</option>
            </select>
          </div>

          <p className="mt-4 text-xs text-slate-500">Showing {filteredMatches.length} of {matches.length} official match records</p>

          <div className="mt-4 space-y-3">
            {filteredMatches.map((match, index) => (
              <article key={`${match.date ?? 'unknown'}-${match.tournament}-${match.round}-${index}`} className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-5 md:grid-cols-[115px_minmax(0,1fr)_minmax(0,0.8fr)_110px] md:items-center">
                <div>
                  <p className="text-xs font-bold text-white">{match.date ? formatDate(match.date) : 'Date not listed'}</p>
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

        {pendingPoints.length > 0 && (
          <section className="rounded-2xl border border-orange-accent/15 bg-orange-accent/5 p-6 text-sm leading-relaxed text-slate-400">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-accent">Pending official updates</p>
            <div className="mt-3 space-y-3">
              {pendingPoints.map((entry) => (
                <div key={entry.tournament}>
                  <p className="font-extrabold text-white">{entry.tournament} — {entry.points.toFixed(2)} points</p>
                  <p className="mt-1">This result remains separate until PSA publishes it. It will only move into the counting or historical tables after official confirmation.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="pb-2 text-center text-[10px] uppercase tracking-[0.18em] text-slate-600">
          Record checked against PSA Secure player history and ranking publications · {formatDate(summary.recordCheckedDate)}
        </p>
      </main>
    </div>
  );
}
