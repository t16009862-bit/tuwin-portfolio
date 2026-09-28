import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const workbook = await fetchWorkbook();
    const row = getSheetRows<Record<string, unknown>>(workbook, 'SiteMusic')[0] ?? {};
    const enabled = String(row.enabled ?? '').trim().toLowerCase() === 'true';

    return NextResponse.json(
      {
        enabled,
        title: String(row.title ?? '').trim(),
        artist: String(row.artist ?? '').trim(),
        youtubeId: String(row.youtubeId ?? '').trim(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch music settings' }, { status: 502 });
  }
}
