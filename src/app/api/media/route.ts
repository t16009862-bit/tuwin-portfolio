import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Articles';

export const dynamic = 'force-dynamic';

function normalizeArticleDate(value: unknown): { label: string; iso: string } {
  let date: Date | undefined;
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  } else if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value.trim());
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date || Number.isNaN(date.getTime())) return { label: '', iso: '' };
  return {
    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    iso: date.toISOString().slice(0, 10),
  };
}

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media sheet' }, { status: 502 });
  }

  const rows = getSheetRows(workbook, SHEET_NAME);

  const items = rows
    .map((row, index) => ({
      id: `media-${index}`,
      category: String(row.category ?? '').trim(),
      source: String(row.source ?? '').trim(),
      date: normalizeArticleDate(row.date).label,
      publishedAt: normalizeArticleDate(row.date).iso,
      title: String(row.title ?? '').trim(),
      description: String(row.description ?? '').trim(),
      linkText: String(row.link_text ?? '').trim(),
      url: String(row.url ?? '').trim(),
      imageUrl: String(row.image_url ?? '').trim(),
      pageUrl: String(row.article_slug ?? '').trim() ? `/media/newspaper/${encodeURIComponent(String(row.article_slug).trim())}` : '',
    }))
    .filter((item) => item.title && item.url);

  return NextResponse.json(items);
}
