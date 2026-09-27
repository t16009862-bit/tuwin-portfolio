'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Tournament = {
  id: number;
  name: string;
  points: number;
  mustCount: boolean;
  pending: boolean;
};

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: 'Indian Challenger 9',
    points: 16.5,
    mustCount: false,
    pending: true,
  },
];

const CHALLENGER_POINTS = [
  { event: 'Challenger 15', places: [300, 195, 120, 75, 45, 27.5] },
  { event: 'Challenger 12', places: [240, 156, 96, 60, 36, 22] },
  { event: 'Challenger 9', places: [180, 117, 72, 45, 27, 16.5] },
  { event: 'Challenger 6', places: [120, 78, 48, 30, 18, 11] },
  { event: 'Challenger 3', places: [60, 39, 24, 15, 9, 5.5] },
];

function getDivisor(tournamentsPlayed: number): number {
  if (tournamentsPlayed <= 15) return 11;
  if (tournamentsPlayed <= 17) return 12;
  if (tournamentsPlayed <= 19) return 13;
  if (tournamentsPlayed === 20) return 14;
  if (tournamentsPlayed === 21) return 15;
  if (tournamentsPlayed === 22) return 16;
  if (tournamentsPlayed === 23) return 17;
  if (tournamentsPlayed === 24) return 20;
  return 20 + (tournamentsPlayed - 24);
}

function displayPoints(points: number): string {
  return points.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function RankingPointsCalculator() {
  const [tournamentsPlayed, setTournamentsPlayed] = useState(1);
  const [tourFinalsBonus, setTourFinalsBonus] = useState(0);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [nextId, setNextId] = useState(2);

  const calculation = useMemo(() => {
    const divisor = getDivisor(tournamentsPlayed);
    const mandatory = tournaments.filter((tournament) => tournament.mustCount);
    const optional = tournaments
      .filter((tournament) => !tournament.mustCount)
      .sort((a, b) => b.points - a.points);
    const selected = [...mandatory, ...optional.slice(0, Math.max(divisor - mandatory.length, 0))];
    const tournamentTotal = selected.reduce((total, tournament) => total + tournament.points, 0);
    const totalPoints = tournamentTotal + tourFinalsBonus;

    return {
      divisor,
      selectedIds: new Set(selected.map((tournament) => tournament.id)),
      tournamentTotal,
      totalPoints,
      average: totalPoints / divisor,
    };
  }, [tournaments, tournamentsPlayed, tourFinalsBonus]);

  function updateTournament(id: number, update: Partial<Tournament>) {
    setTournaments((current) => current.map((tournament) => (
      tournament.id === id ? { ...tournament, ...update } : tournament
    )));
  }

  function addTournament() {
    setTournaments((current) => [
      ...current,
      { id: nextId, name: `Tournament ${nextId}`, points: 0, mustCount: false, pending: false },
    ]);
    setNextId((current) => current + 1);
    setTournamentsPlayed((current) => Math.max(current, tournaments.length + 1));
  }

  function removeTournament(id: number) {
    setTournaments((current) => current.filter((tournament) => tournament.id !== id));
  }

  function resetCalculator() {
    setTournamentsPlayed(1);
    setTourFinalsBonus(0);
    setTournaments(INITIAL_TOURNAMENTS);
    setNextId(2);
  }

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
          <Link
            href="/#career"
            className="rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest text-cyan-accent transition-all hover:bg-cyan-accent hover:text-black"
          >
            ← Back to rankings
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
        <section className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent">PSA World Rankings</p>
          <h1 className="text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Ranking points <span className="text-gradient-cyan-solid">calculator</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Add every tournament played in the rolling 52-week period. The calculator keeps the required
            counting results, adds any PSA Squash Tour Finals bonus, and divides the total by the official divisor.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ranking calculation summary">
          {[
            ['Tournaments played', tournamentsPlayed.toString()],
            ['Counting divisor', calculation.divisor.toString()],
            ['Counting points', displayPoints(calculation.totalPoints)],
            ['Ranking average', displayPoints(calculation.average)],
          ].map(([label, value], index) => (
            <div key={label} className={`p-6 ${index === 3 ? 'glass-card-layered-orange' : 'glass-card-layered'}`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className={`mt-2 text-3xl font-black ${index === 3 ? 'text-orange-accent' : 'text-white'}`}>{value}</p>
            </div>
          ))}
        </section>

        <section className="glass-card-layered relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/5 pb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">Your results</p>
                <h2 className="mt-2 text-2xl font-extrabold uppercase">Tournament points</h2>
              </div>
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Played in 52 weeks</span>
                <input
                  type="number"
                  min="0"
                  value={tournamentsPlayed}
                  onChange={(event) => setTournamentsPlayed(Math.max(0, Number(event.target.value) || 0))}
                  className="w-32 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-right text-lg font-bold text-white outline-none transition-colors focus:border-cyan-accent/70"
                />
              </label>
            </div>

            <div className="mt-6 space-y-3">
              {tournaments.map((tournament) => {
                const isCounting = calculation.selectedIds.has(tournament.id);
                return (
                  <div key={tournament.id} className="grid gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 md:grid-cols-[minmax(0,1fr)_130px_150px_44px] md:items-center">
                    <div>
                      <input
                        aria-label="Tournament name"
                        value={tournament.name}
                        onChange={(event) => updateTournament(tournament.id, { name: event.target.value })}
                        className="w-full border-b border-transparent bg-transparent pb-1 font-bold text-white outline-none transition-colors focus:border-cyan-accent/50"
                      />
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${isCounting ? 'bg-cyan-accent/15 text-cyan-accent' : 'bg-white/5 text-slate-500'}`}>
                          {isCounting ? 'Counting' : 'Not counting'}
                        </span>
                        {tournament.pending && (
                          <span className="rounded-full bg-orange-accent/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-orange-accent">
                            Next ranking upload
                          </span>
                        )}
                      </div>
                    </div>

                    <label>
                      <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-slate-500">Points</span>
                      <input
                        aria-label={`${tournament.name} points`}
                        type="number"
                        min="0"
                        step="0.25"
                        value={tournament.points}
                        onChange={(event) => updateTournament(tournament.id, { points: Math.max(0, Number(event.target.value) || 0) })}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-right font-bold text-white outline-none focus:border-cyan-accent/70"
                      />
                    </label>

                    <label className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={tournament.mustCount}
                        onChange={(event) => updateTournament(tournament.id, { mustCount: event.target.checked })}
                        className="h-4 w-4 accent-cyan-400"
                      />
                      Mandatory result
                    </label>

                    <button
                      type="button"
                      onClick={() => removeTournament(tournament.id)}
                      aria-label={`Remove ${tournament.name}`}
                      className="h-10 w-10 rounded-full border border-white/10 text-slate-500 transition-colors hover:border-red-400/50 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addTournament}
                className="rounded-full bg-cyan-accent px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-widest text-black transition-transform hover:scale-[1.02]"
              >
                + Add tournament
              </button>
              <button
                type="button"
                onClick={resetCalculator}
                className="rounded-full border border-white/10 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 transition-colors hover:border-white/30 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-card-layered p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">The exact formula</p>
            <div className="mt-5 rounded-2xl border border-cyan-accent/15 bg-cyan-accent/5 p-5 text-center">
              <p className="text-sm font-bold text-white">Ranking average</p>
              <p className="mt-2 text-sm text-slate-300">
                (Counting tournament points + Tour Finals bonus) ÷ counting divisor
              </p>
              <p className="mt-4 text-2xl font-black text-cyan-accent">
                ({displayPoints(calculation.tournamentTotal)} + {displayPoints(tourFinalsBonus)}) ÷ {calculation.divisor} = {displayPoints(calculation.average)}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-5">
              {[
                ['≤15 played', '÷ 11'],
                ['16–17', '÷ 12'],
                ['18–19', '÷ 13'],
                ['20–23', '÷ 14–17'],
                ['24 played', '÷ 20'],
              ].map(([played, divisor]) => (
                <div key={played} className="rounded-xl border border-white/5 bg-white/[0.025] px-2 py-3">
                  <p className="text-slate-500">{played}</p>
                  <p className="mt-1 font-extrabold text-white">{divisor}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">At 20, 21, 22 and 23 events the divisors are 14, 15, 16 and 17. Above 24 events, the divisor rises by one per extra event.</p>

            <label className="mt-6 block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">PSA Squash Tour Finals bonus</span>
              <input
                type="number"
                min="0"
                step="0.25"
                value={tourFinalsBonus}
                onChange={(event) => setTourFinalsBonus(Math.max(0, Number(event.target.value) || 0))}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-bold text-white outline-none focus:border-cyan-accent/70"
              />
              <span className="mt-2 block text-xs leading-relaxed text-slate-500">
                Ordinary match wins do not create separate match points. Final placing sets the tournament points. Match-win bonus points apply at the PSA Squash Tour Finals.
              </span>
            </label>
          </div>

          <div className="glass-card-layered-orange p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-accent">India result</p>
            <h2 className="mt-3 text-2xl font-extrabold uppercase">16.5 points pending</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              A 17–32 finish at a Challenger 9 event is worth 16.5 points. The result remains on the ranking for 52 weeks, starting with the next published Monday ranking after the event ends.
            </p>
            <div className="mt-6 rounded-2xl border border-orange-accent/15 bg-orange-accent/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Projected contribution</p>
              <p className="mt-2 text-3xl font-black text-orange-accent">+16.5</p>
              <p className="mt-2 text-xs text-slate-500">Included in the calculator until replaced with the uploaded PSA record.</p>
            </div>
          </div>
        </section>

        <section className="glass-card-layered overflow-hidden p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-accent">Official 2026 table</p>
              <h2 className="mt-2 text-2xl font-extrabold uppercase">Challenger points reference</h2>
            </div>
            <p className="text-xs text-slate-500">Place: 1 / 2 / 3–4 / 5–8 / 9–16 / 17–32</p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
            <table className="min-w-[680px] w-full text-sm">
              <thead className="bg-white/[0.035] text-[10px] uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Event</th>
                  {['1', '2', '3–4', '5–8', '9–16', '17–32'].map((place) => <th key={place} className="px-4 py-3 text-right">{place}</th>)}
                </tr>
              </thead>
              <tbody>
                {CHALLENGER_POINTS.map((row) => (
                  <tr key={row.event} className="border-t border-white/5 text-slate-300">
                    <th className="px-4 py-3 text-left font-bold text-white">{row.event}</th>
                    {row.places.map((points, index) => <td key={`${row.event}-${index}`} className="px-4 py-3 text-right">{displayPoints(points)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-white/[0.025] p-6 text-xs leading-relaxed text-slate-500">
          <p>
            This is a projection tool based on the 2026 PSA Squash Tour Rule Book. The official PSA ranking remains authoritative. World Championship results and applicable zero scores must be marked as mandatory; the other counting places are filled by the highest-point results.
          </p>
        </section>
      </main>
    </div>
  );
}
