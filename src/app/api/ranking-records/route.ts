import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

export const dynamic = 'force-dynamic';

const text = (value: unknown) => String(value ?? '').trim();
const number = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export async function GET() {
  try {
    const workbook = await fetchWorkbook();
    const summaryRow = getSheetRows<Record<string, unknown>>(workbook, 'RankingSummary')[0] ?? {};

    const summary = {
      publishedDate: text(summaryRow.publishedDate),
      recordCheckedDate: text(summaryRow.recordCheckedDate),
      worldRanking: number(summaryRow.worldRanking),
      highestRanking: number(summaryRow.highestRanking),
      totalPoints: number(summaryRow.totalPoints),
      countingPoints: number(summaryRow.countingPoints),
      divisor: number(summaryRow.divisor),
      emptyDivisorPlaces: number(summaryRow.emptyDivisorPlaces),
      otherRankingZeros: number(summaryRow.otherRankingZeros),
    };

    const tournamentPoints = getSheetRows<Record<string, unknown>>(workbook, 'TournamentPoints')
      .map((row) => ({
        date: text(row.date),
        tournament: text(row.tournament),
        result: text(row.result),
        points: number(row.points),
        expires: text(row.expires),
        status: text(row.status),
      }))
      .filter((entry) => entry.tournament);

    const medicalZeros = getSheetRows<Record<string, unknown>>(workbook, 'MedicalZeros')
      .map((row) => ({
        date: text(row.date),
        tournament: text(row.tournament),
        expires: text(row.expires),
        status: text(row.status),
      }))
      .filter((entry) => entry.tournament);

    const rankingZeros = getSheetRows<Record<string, unknown>>(workbook, 'RankingZeros')
      .map((row) => ({
        date: text(row.date),
        tournament: text(row.tournament),
        reason: text(row.reason),
        expires: text(row.expires),
        status: text(row.status),
      }))
      .filter((entry) => entry.tournament);

    const withdrawals = getSheetRows<Record<string, unknown>>(workbook, 'Withdrawals')
      .map((row) => ({
        startDate: text(row.startDate),
        endDate: text(row.endDate),
        tournament: text(row.tournament),
        status: text(row.status),
      }))
      .filter((entry) => entry.tournament);

    const matches = getSheetRows<Record<string, unknown>>(workbook, 'MatchHistory')
      .map((row) => ({
        date: text(row.date) || null,
        year: text(row.year),
        tournament: text(row.tournament),
        round: text(row.round),
        opponent: text(row.opponent),
        score: text(row.score),
        games: text(row.games),
        result: text(row.result),
      }))
      .filter((entry) => entry.tournament && (entry.result === 'Won' || entry.result === 'Lost'));

    return NextResponse.json(
      { summary, tournamentPoints, medicalZeros, rankingZeros, withdrawals, matches },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ranking records' }, { status: 502 });
  }
}
