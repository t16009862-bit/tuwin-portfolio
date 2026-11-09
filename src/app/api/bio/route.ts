import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Bio';

export const dynamic = 'force-dynamic';

function calculateAge(birthday: string): string {
  const dob = new Date(`${birthday}T00:00:00Z`);
  if (Number.isNaN(dob.getTime())) return '';

  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const hasHadBirthdayThisYear =
    today.getUTCMonth() > dob.getUTCMonth() ||
    (today.getUTCMonth() === dob.getUTCMonth() && today.getUTCDate() >= dob.getUTCDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age >= 0 ? String(age) : '';
}

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bio sheet' }, { status: 502 });
  }

  const [row] = getSheetRows<Record<string, unknown>>(workbook, SHEET_NAME);
  const birthday = String(row?.Birthday ?? '').trim();

  return NextResponse.json({
    name: String(row?.Name ?? '').trim(),
    birthday,
    worldRank: String(row?.['World Rank'] ?? '').trim(),
    age: calculateAge(birthday),
    description: String(row?.Description ?? '').trim(),
    profileImage: String(row?.['Profile Image'] ?? '').trim(),
  });
}
