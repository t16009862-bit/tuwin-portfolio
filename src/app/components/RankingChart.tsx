'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface RankingPoint {
  date: string;
  ranking: number;
}

type RangeFilter = 'all' | '5y' | '3y' | '2y' | '12m' | '6m';

const RANGE_OPTIONS: { key: RangeFilter; label: string }[] = [
  { key: 'all', label: 'All Time' },
  { key: '5y', label: '5 Years' },
  { key: '3y', label: '3 Years' },
  { key: '2y', label: '2 Years' },
  { key: '12m', label: '12 Months' },
  { key: '6m', label: '6 Months' },
];

// Ranges shown year-wise use the latest ranking recorded in each calendar year
const YEAR_WISE_RANGES: RangeFilter[] = ['5y', '3y', '2y'];

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;
const PADDING = { top: 20, right: 16, bottom: 28, left: 44 };

function formatDate(dateStr: string, withYear = false): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: withYear ? 'numeric' : undefined,
  });
}

export default function RankingChart({ rankings }: { rankings: RankingPoint[] }) {
  const [range, setRange] = useState<RangeFilter>('all');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const filtered = useMemo(() => {
    if (range === 'all' || rankings.length === 0) return rankings;

    const months = range === '5y' ? 60 : range === '3y' ? 36 : range === '2y' ? 24 : range === '12m' ? 12 : 6;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const inRange = rankings.filter((r) => new Date(r.date) >= cutoff);
    const base = inRange.length >= 2 ? inRange : rankings;

    if (!YEAR_WISE_RANGES.includes(range)) return base;

    // Collapse to one point per year — the latest ranking recorded that year
    const latestPerYear = new Map<number, RankingPoint>();
    base.forEach((r) => {
      const year = new Date(r.date).getFullYear();
      const existing = latestPerYear.get(year);
      if (!existing || new Date(r.date) > new Date(existing.date)) {
        latestPerYear.set(year, r);
      }
    });
    return Array.from(latestPerYear.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [rankings, range]);

  const yearWise = YEAR_WISE_RANGES.includes(range);

  if (rankings.length === 0) return null;

  const latest = rankings[rankings.length - 1];
  const previous = rankings.length > 1 ? rankings[rankings.length - 2] : null;
  // Positive = rank improved (lower number); negative = rank dropped (higher number)
  const delta = previous ? previous.ranking - latest.ranking : 0;
  const peakRank = Math.min(...rankings.map((r) => r.ranking));

  const rankValues = filtered.map((r) => r.ranking);
  const minRank = Math.min(...rankValues);
  const maxRank = Math.max(...rankValues);
  const rankSpan = Math.max(maxRank - minRank, 1);

  const plotW = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const points = filtered.map((r, i) => {
    const x = PADDING.left + (filtered.length === 1 ? plotW / 2 : (i / (filtered.length - 1)) * plotW);
    // Inverted: lower ranking number (better) sits higher on the chart
    const y = PADDING.top + ((r.ranking - minRank) / rankSpan) * plotH;
    return { x, y, ...r };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${PADDING.top + plotH} L ${points[0].x.toFixed(2)} ${PADDING.top + plotH} Z`;

  const yTicks = [minRank, Math.round((minRank + maxRank) / 2), maxRank];
  const xTickIdxs = yearWise
    ? filtered.map((_, i) => i)
    : filtered.length > 1
      ? Array.from(new Set([0, Math.floor((filtered.length - 1) / 2), filtered.length - 1]))
      : [0];

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = CHART_WIDTH / rect.width;
    const relX = (e.clientX - rect.left) * scaleX;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  };

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="glass-card-layered p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] wave-contour-pattern pointer-events-none"></div>

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-6 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-accent mb-2">Ranking History</p>
          <h3 className="text-2xl font-extrabold tracking-tight text-white uppercase">World Ranking</h3>
        </div>

        <div className="flex items-start gap-8">
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Current</div>
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-3xl font-extrabold text-white tracking-tight">#{latest.ranking}</span>
              {previous && delta !== 0 && (
                <span className={`text-sm font-bold ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({delta > 0 ? '+' : ''}{delta})
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Highest Rank</div>
            <span className="text-3xl font-extrabold text-cyan-accent tracking-tight">#{peakRank}</span>
          </div>
        </div>
      </div>

      {/* Range filter */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-6">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRange(opt.key)}
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              range === opt.key
                ? 'bg-cyan-accent text-black shadow-md shadow-cyan-accent/20'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:border-cyan-accent/50 hover:text-cyan-accent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative z-10">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label={`World ranking history chart, current rank ${latest.ranking}`}
        >
          {/* Gridlines */}
          {yTicks.map((tick, i) => {
            const y = PADDING.top + ((tick - minRank) / rankSpan) * plotH;
            return (
              <g key={i}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={CHART_WIDTH - PADDING.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                />
                <text x={PADDING.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-slate-500" fontSize={10}>
                  #{tick}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {xTickIdxs.map((idx) => (
            <text
              key={idx}
              x={points[idx].x}
              y={CHART_HEIGHT - 8}
              textAnchor="middle"
              className="fill-slate-500"
              fontSize={10}
            >
              {yearWise ? new Date(points[idx].date).getFullYear() : formatDate(points[idx].date, true)}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="var(--accent-cyan)" opacity={0.1} />

          {/* Line */}
          <path d={linePath} fill="none" stroke="var(--accent-cyan)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* End marker */}
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={5} fill="var(--accent-cyan)" stroke="#06070a" strokeWidth={2} />

          {/* Crosshair + hover marker */}
          {hovered && (
            <g>
              <line
                x1={hovered.x}
                y1={PADDING.top}
                x2={hovered.x}
                y2={PADDING.top + plotH}
                stroke="rgba(13,244,255,0.3)"
                strokeWidth={1}
              />
              <circle cx={hovered.x} cy={hovered.y} r={5} fill="var(--accent-cyan)" stroke="#06070a" strokeWidth={2} />
            </g>
          )}

          {/* Hit layer */}
          <rect
            x={PADDING.left}
            y={0}
            width={plotW}
            height={CHART_HEIGHT}
            fill="transparent"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIdx(null)}
            style={{ cursor: 'crosshair' }}
          />
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute pointer-events-none rounded-lg border border-cyan-accent/30 bg-[#0d111a] px-3 py-2 shadow-xl text-xs"
            style={{
              left: `${(hovered.x / CHART_WIDTH) * 100}%`,
              top: `${(hovered.y / CHART_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -130%)',
            }}
          >
            <div className="text-white font-bold">#{hovered.ranking}</div>
            <div className="text-slate-400">{formatDate(hovered.date, true)}</div>
          </div>
        )}
      </div>

      {/* Table view toggle for accessibility */}
      <div className="relative z-10 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-accent transition-colors cursor-pointer"
          >
            {showTable ? 'Hide' : 'View'} as table
          </button>

          <Link
            href="/rankings/match-history"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-accent transition-all hover:border-cyan-accent hover:bg-cyan-accent hover:text-black"
          >
            Rankings &amp; match history
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {showTable && (
          <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-white/5">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-2 font-bold">Date</th>
                  <th className="text-right px-4 py-2 font-bold">Ranking</th>
                </tr>
              </thead>
              <tbody>
                {[...filtered].reverse().map((r, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 text-slate-300">
                    <td className="px-4 py-2">{formatDate(r.date, true)}</td>
                    <td className="px-4 py-2 text-right font-semibold">#{r.ranking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
