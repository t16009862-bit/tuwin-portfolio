import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

export const dynamic = 'force-dynamic';

const text = (value: unknown) => String(value ?? '').trim();

function calculateAge(birthday: string): string {
  const dob = new Date(`${birthday}T00:00:00Z`);
  if (Number.isNaN(dob.getTime())) return '';

  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const birthdayPassed =
    today.getUTCMonth() > dob.getUTCMonth() ||
    (today.getUTCMonth() === dob.getUTCMonth() && today.getUTCDate() >= dob.getUTCDate());

  if (!birthdayPassed) age -= 1;
  return age >= 0 ? String(age) : '';
}

export async function GET() {
  try {
    // The old homepage downloaded this same workbook eleven separate times.
    // Read it once, then return one stable homepage payload.
    const workbook = await fetchWorkbook();

    const bioRow = getSheetRows<Record<string, unknown>>(workbook, 'Bio')[0] ?? {};
    const birthday = text(bioRow.Birthday);

    const biographyRows = getSheetRows<Record<string, unknown>>(workbook, 'Biograpahy');
    const contactRow = getSheetRows<Record<string, unknown>>(workbook, 'Contact')[0] ?? {};

    const coaches: { name: string; profile: string[]; biography: string; imageUrl: string }[] = [];
    for (const row of getSheetRows<Record<string, unknown>>(workbook, 'Coach&Club')) {
      const name = text(row.Name);
      const profilePoint = text(row.Profile);
      if (name) {
        coaches.push({
          name,
          profile: profilePoint ? [profilePoint] : [],
          biography: text(row.Biography),
          imageUrl: text(row['Image Url']),
        });
      } else if (profilePoint && coaches.length > 0) {
        coaches[coaches.length - 1].profile.push(profilePoint);
      }
    }

    return NextResponse.json({
      bio: {
        name: text(bioRow.Name),
        worldRank: text(bioRow['World Rank']),
        age: calculateAge(birthday),
        description: text(bioRow.Description),
        profileImage: text(bioRow['Profile Image']),
      },
      sponsors: getSheetRows<Record<string, unknown>>(workbook, 'Sponsors')
        .map((row) => ({
          name: text(row.Name),
          imageUrl: text(row.Image_Url),
          status: text(row.Status).toLowerCase(),
          description: text(row.Description),
        }))
        .filter((item) => item.imageUrl),
      rankings: getSheetRows<Record<string, unknown>>(workbook, 'Rankings')
        .map((row) => ({ date: text(row.date), ranking: Number(row.ranking) }))
        .filter((item) => item.date && Number.isFinite(item.ranking))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      tournaments: getSheetRows<Record<string, unknown>>(workbook, 'UpcomingTournaments')
        .map((row) => ({
          name: text(row.Name),
          venue: text(row.Venue),
          tournamentSize: text(row['Tournament Size']),
          startDate: text(row['Start Date']),
          endDate: text(row['End Date']),
          category: text(row['Tournament Category']),
          status: text(row.Status),
          logos: text(row.logo).split(',').map((logo) => logo.trim()).filter(Boolean),
        }))
        .filter((item) => item.name && item.status.toLowerCase() === 'upcoming'),
      coaches,
      contact: {
        locations: text(contactRow.Locations),
        email: text(contactRow.email),
        phoneNumbers: text(contactRow['phone numbers']).split(',').map((phone) => phone.trim()).filter(Boolean),
      },
      careerAchievements: getSheetRows<Record<string, unknown>>(workbook, 'CareerAchievements')
        .map((row) => ({
          title: text(row.Title),
          heading: text(row.heading),
          description: text(row.description),
          footer: text(row.footer),
        }))
        .filter((item) => item.title || item.heading),
      timelineData: getSheetRows<Record<string, unknown>>(workbook, 'CareerHighlights')
        .map((row) => ({
          year: text(row.year),
          title: text(row.title),
          description: text(row.description),
          tag: text(row.tag),
          icon: text(row.icon),
        }))
        .filter((item) => item.year && item.title),
      competencyPoints: getSheetRows<Record<string, unknown>>(workbook, 'CompetencyBlueprint')
        .map((row) => text(row.blueprints))
        .filter(Boolean),
      trainingHistory: getSheetRows<Record<string, unknown>>(workbook, 'TrainingHistory')
        .map((row) => ({
          title: text(row.title),
          heading: text(row.heading),
          description: text(row.description),
        }))
        .filter((item) => item.title || item.heading),
      biography: {
        description: biographyRows.map((row) => text(row.description)).find(Boolean) ?? '',
        highlights: biographyRows
          .map((row) => ({
            title: text(row.Title),
            heading: text(row.Heading),
            description: text(row.Description),
          }))
          .filter((item) => item.title || item.heading),
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch homepage data' }, { status: 502 });
  }
}
