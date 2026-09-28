export type MatchResult = 'Won' | 'Lost';

export type Match = {
  date: string | null;
  year: string;
  tournament: string;
  round: string;
  opponent: string;
  score: string;
  games: string;
  result: MatchResult;
};

export type PointsEntry = {
  date: string;
  tournament: string;
  result: string;
  points: number;
  expires: string;
};

export type MedicalZero = {
  date: string;
  tournament: string;
  expires: string;
  status: 'Active' | 'Expired';
};

export type NoPenaltyWithdrawal = {
  startDate: string;
  endDate: string;
  tournament: string;
};

export type RankingSummary = {
  publishedDate: string;
  recordCheckedDate: string;
  worldRanking: number;
  highestRanking: number;
  totalPoints: number;
  countingPoints: number;
  divisor: number;
  emptyDivisorPlaces: number;
  otherRankingZeros: number;
};

export type RankingZero = {
  date: string;
  tournament: string;
  reason: string;
  expires: string;
  status: 'Active' | 'Expired';
};

export const DEFAULT_RANKING_SUMMARY: RankingSummary = {
  publishedDate: '2026-09-21',
  recordCheckedDate: '2026-09-27',
  worldRanking: 445,
  highestRanking: 316,
  totalPoints: 112.5,
  countingPoints: 112.5,
  divisor: 11,
  emptyDivisorPlaces: 3,
  otherRankingZeros: 0,
};

// Complete match history currently available in the official PSA Secure player record.
// “TBD” and “Date not listed” are PSA placeholders and are intentionally preserved.
export const MATCHES: Match[] = [
  { date: '2026-09-26', year: '2026', tournament: 'JSW 12th Sunil Verma Memorial Tournament 2026', round: 'Round 1', opponent: 'Hridhaan Kamalbhai Shah', score: '0–3', games: '3–11, 6–11, 3–11', result: 'Lost' },
  { date: '2026-09-07', year: '2026', tournament: 'KCC PSA Challenge Cup 2026', round: 'Round 1', opponent: 'Tay Jun Qian', score: '1–3', games: '11–9, 7–11, 3–11, 4–11', result: 'Lost' },
  { date: '2026-08-24', year: '2026', tournament: '2nd CAS International Squash 2026', round: 'Round 1', opponent: 'Shota Yasunari', score: '0–3', games: '5–11, 4–11, 5–11', result: 'Lost' },
  { date: '2026-06-24', year: '2026', tournament: 'Greetings Squash PSA Challenger 2026', round: 'Round of 16', opponent: 'Wailok To', score: '0–3', games: '8–11, 3–11, 5–11', result: 'Lost' },
  { date: '2025-10-24', year: '2025', tournament: 'China Squash Tour 2025 S3', round: 'Round of 16', opponent: 'Tsun Hei Mak', score: '1–3', games: '11–7, 7–11, 9–11, 6–11', result: 'Lost' },
  { date: '2025-09-27', year: '2025', tournament: 'HCL Squash Indian Tour 3, Bengaluru 2025', round: 'Round of 16', opponent: 'Suraj Kumar Chand', score: '0–3', games: '8–11, 9–11, 6–11', result: 'Lost' },
  { date: '2025-09-26', year: '2025', tournament: 'HCL Squash Indian Tour 3, Bengaluru 2025', round: 'Round of 32', opponent: 'Divit Poojary', score: '3–0', games: '11–3, 11–4, 11–4', result: 'Won' },
  { date: '2025-09-17', year: '2025', tournament: 'Reliance PSA Challenger Championship 2025', round: 'Round of 32', opponent: 'Mostafa Mekki', score: '1–3', games: '12–14, 11–3, 9–11, 4–11', result: 'Lost' },
  { date: '2025-05-30', year: '2025', tournament: 'Northern Star Resources Ltd Golden Open 2025', round: 'Quarter-Final', opponent: 'Ravindu Laksiri', score: '0–3', games: '3–11, 2–11, 3–11', result: 'Lost' },
  { date: '2025-05-30', year: '2025', tournament: 'Northern Star Resources Ltd Golden Open 2025', round: 'Round 1', opponent: 'Naoki Hayashi', score: '3–2', games: '12–10, 11–2, 4–11, 7–11, 11–7', result: 'Won' },
  { date: '2025-05-23', year: '2025', tournament: 'Auckland Open PSA Challenger 2025', round: 'Round 2', opponent: 'Freddie Jameson', score: '0–3', games: '5–11, 3–11, 7–11', result: 'Lost' },
  { date: '2025-05-09', year: '2025', tournament: 'NT Open 2025', round: 'Round 2', opponent: 'Shamil Wakeel', score: '0–3', games: '4–11, 3–11, 4–11', result: 'Lost' },
  { date: '2025-05-08', year: '2025', tournament: 'NT Open 2025', round: 'Round 1', opponent: 'Darcy Hayes', score: '3–2', games: '11–6, 6–11, 11–5, 5–11, 11–6', result: 'Won' },
  { date: '2024-12-18', year: '2024', tournament: '79 CCI Western India 2024', round: 'Round 1', opponent: 'Rahul Baitha', score: '0–3', games: '3–11, 8–11, 7–11', result: 'Lost' },
  { date: '2024-11-15', year: '2024', tournament: 'Bondi Open 2024', round: 'Quarter-Final', opponent: 'Oliver Dunbar', score: '0–3', games: '2–11, 4–11, 4–11', result: 'Lost' },
  { date: '2024-11-14', year: '2024', tournament: 'Bondi Open 2024', round: 'Round 2', opponent: "Gianluca Bushell-O'Connor", score: '3–2', games: '3–11, 7–11, 14–12, 11–7, 11–4', result: 'Won' },
  { date: '2024-11-06', year: '2024', tournament: 'Alto Pennant Hills NSW Open 2024', round: 'Round 1', opponent: 'Kasper Cheung', score: '1–3', games: '9–11, 11–4, 6–11, 14–16', result: 'Lost' },
  { date: '2024-08-28', year: '2024', tournament: 'HCL Squash Tour – Kolkata 2024', round: 'Round 2', opponent: 'Vedant Patel', score: '0–3', games: '2–11, 9–11, 9–11', result: 'Lost' },
  { date: '2024-08-27', year: '2024', tournament: 'HCL Squash Tour – Kolkata 2024', round: 'Round 1', opponent: 'Rounak Yadav', score: '3–0', games: '11–9, 11–9, 11–3', result: 'Won' },
  { date: '2024-08-16', year: '2024', tournament: 'Reliance PSA Challenge 3 Tournament 2024', round: 'Quarter-Final', opponent: 'Ravindu Laksiri', score: '0–3', games: '3–11, 2–11, 3–11', result: 'Lost' },
  { date: '2024-08-15', year: '2024', tournament: 'Reliance PSA Challenge 3 Tournament 2024', round: 'Round 2', opponent: 'Sepehr Etemadpoor', score: 'W/O', games: 'Walkover', result: 'Won' },
  { date: '2024-08-15', year: '2024', tournament: 'Reliance PSA Challenge 3 Tournament 2024', round: 'Round 1', opponent: 'Ilham Asmone', score: '3–1', games: '6–11, 11–5, 11–3, 11–3', result: 'Won' },
  { date: '2024-07-10', year: '2024', tournament: 'ACE Challenger 6K 2nd Leg 2024', round: 'Round 1', opponent: 'Erwin Christopher', score: '1–3', games: '5–11, 11–8, 7–11, 3–11', result: 'Lost' },
  { date: '2024-06-27', year: '2024', tournament: "PSNS President's Trophy 2024", round: 'Round 2', opponent: 'Ziad Ibrahim', score: '0–3', games: '1–11, 7–11, 2–11', result: 'Lost' },
  { date: '2024-06-26', year: '2024', tournament: "PSNS President's Trophy 2024", round: 'Round 1', opponent: 'Isaac Vivek', score: '3–1', games: '11–6, 11–5, 4–11, 11–9', result: 'Won' },
  { date: '2024-06-05', year: '2024', tournament: 'HCL Squash Tour – Chennai 2024', round: 'Round 2', opponent: 'Ravi Dixit', score: '1–3', games: '7–11, 11–8, 6–11, 7–11', result: 'Lost' },
  { date: null, year: '2024', tournament: 'HCL Squash Tour – Chennai 2024', round: 'Round 1', opponent: 'TBD', score: '—', games: 'PSA does not list the opponent or score', result: 'Won' },
  { date: '2024-05-23', year: '2024', tournament: 'HCL Squash Tour – Indore 2024', round: 'Round 2', opponent: 'Tavneet Singh Mundra', score: '1–3', games: '11–7, 7–11, 2–11, 9–11', result: 'Lost' },
  { date: null, year: '2024', tournament: 'HCL Squash Tour – Indore 2024', round: 'Round 1', opponent: 'TBD', score: '—', games: 'PSA does not list the opponent or score', result: 'Won' },
  { date: '2024-05-10', year: '2024', tournament: 'LTD Open Squash Tournament 2024', round: 'Quarter-Final', opponent: 'Shamil Wakeel', score: '0–3', games: '2–11, 5–11, 2–11', result: 'Lost' },
  { date: '2024-05-09', year: '2024', tournament: 'LTD Open Squash Tournament 2024', round: 'Round 2', opponent: 'Naresh Shingva', score: '3–1', games: '11–8, 11–5, 9–11, 11–3', result: 'Won' },
  { date: null, year: '2024', tournament: 'LTD Open Squash Tournament 2024', round: 'Round 1', opponent: 'TBD', score: '—', games: 'PSA does not list the opponent or score', result: 'Won' },
  { date: '2024-04-24', year: '2024', tournament: 'Hamdard Squashters Northern Slam 2024', round: 'Round 2', opponent: 'Jeongmin Ryu', score: '0–3', games: '5–11, 8–11, 2–11', result: 'Lost' },
  { date: '2024-04-23', year: '2024', tournament: 'Hamdard Squashters Northern Slam 2024', round: 'Round 1', opponent: 'Rounak Yadav', score: '3–0', games: '11–5, 11–6, 11–9', result: 'Won' },
  { date: '2024-01-14', year: '2024', tournament: 'JSW Willingdon Little Masters & Senior Tournament 2024', round: 'Round 2', opponent: 'Vedant Patel', score: '0–3', games: '8–11, 5–11, 8–11', result: 'Lost' },
  { date: null, year: '2024', tournament: 'JSW Willingdon Little Masters & Senior Tournament 2024', round: 'Round 1', opponent: 'TBD', score: '—', games: 'PSA does not list the opponent or score', result: 'Won' },
  { date: '2023-09-27', year: '2023', tournament: '3rd Bangabandhu Squash Tournament 2023 Presented by Ispahani', round: 'Round 2', opponent: 'Hazem Hossam', score: '0–3', games: '3–11, 11–13, 8–11', result: 'Lost' },
  { date: null, year: '2023', tournament: '3rd Bangabandhu Squash Tournament 2023 Presented by Ispahani', round: 'Round 1', opponent: 'TBD', score: '—', games: 'PSA does not list the opponent or score', result: 'Won' },
];

// Official September 21, 2026 ranking publication.
export const CURRENT_COUNTING_POINTS: PointsEntry[] = [
  { date: '2026-08-31', tournament: '2nd CAS International Squash 2026', result: 'Round of 32', points: 22, expires: '2027-08-30' },
  { date: '2026-06-29', tournament: 'Greetings Squash PSA Challenger 2026', result: 'Round of 16', points: 18, expires: '2027-06-28' },
  { date: '2025-10-06', tournament: 'HCL Squash Indian Tour 3, Bengaluru 2025', result: 'Round of 16', points: 18, expires: '2026-10-05' },
  { date: '2025-12-27', tournament: '45th Senior Nationals (Sri Lanka) Squash Championship 2025', result: 'Round of 16', points: 15, expires: '2026-12-26' },
  { date: '2025-12-03', tournament: 'China Squash Tour 2025 S5', result: 'Semi-finalist', points: 12, expires: '2026-12-02' },
  { date: '2026-09-14', tournament: 'KCC PSA Challenge Cup 2026', result: 'Round of 32', points: 11, expires: '2027-09-13' },
  { date: '2025-10-27', tournament: 'China Squash Tour 2025 S3', result: 'Round of 16', points: 9, expires: '2026-10-26' },
  { date: '2025-11-22', tournament: 'China Squash Tour 2025 S4', result: 'Quarter-finalist', points: 7.5, expires: '2026-11-21' },
];

export const PENDING_POINTS: PointsEntry[] = [
  { date: '', tournament: 'JSW 12th Sunil Verma Memorial Tournament 2026', result: 'Round of 32', points: 16.5, expires: '' },
];

// Earlier official PSA ranking publications were checked to preserve the recorded
// points date and expiry date even after an event disappeared from the current table.
export const EXPIRED_POINTS: PointsEntry[] = [
  { date: '2025-09-22', tournament: 'Reliance PSA Challenger Championship 2025', result: 'Round of 32', points: 11, expires: '2026-09-21' },
  { date: '2025-06-01', tournament: 'Northern Star Resources Ltd Golden Open 2025', result: 'Quarter-finalist', points: 30, expires: '2026-05-31' },
  { date: '2025-05-25', tournament: 'Auckland Open PSA Challenger 2025', result: 'Round of 16', points: 9, expires: '2026-05-24' },
  { date: '2025-05-11', tournament: 'NT Open 2025', result: 'Round of 16', points: 9, expires: '2026-05-10' },
  { date: '2025-03-20', tournament: 'QSF 3 PSA Satellite (1K) 2025', result: 'Semi-finalist', points: 12, expires: '2026-03-19' },
  { date: '2025-01-07', tournament: '44th Senior National (Sri Lanka) Squash Championship 2025', result: 'Quarter-finalist', points: 25, expires: '2026-01-06' },
  { date: '2024-12-22', tournament: '79 CCI Western India 2024', result: 'Round of 32', points: 16.5, expires: '2025-12-21' },
  { date: '2024-11-17', tournament: 'Bondi Open 2024', result: 'Quarter-finalist', points: 15, expires: '2025-11-16' },
  { date: '2024-11-10', tournament: 'Alto Pennant Hills NSW Open 2024', result: 'Round of 32', points: 11, expires: '2025-11-09' },
  { date: '2024-08-31', tournament: 'HCL Squash Tour – Kolkata 2024', result: 'Round of 16', points: 9, expires: '2025-08-30' },
  { date: '2024-08-18', tournament: 'Reliance PSA Challenge 3 Tournament 2024', result: 'Quarter-finalist', points: 15, expires: '2025-08-17' },
  { date: '2024-07-14', tournament: 'ACE Challenger 6K 2nd Leg 2024', result: 'Round of 32', points: 9, expires: '2025-07-13' },
  { date: '2024-06-30', tournament: "PSNS President's Trophy 2024", result: 'Round of 16', points: 15, expires: '2025-06-29' },
  { date: '2024-06-08', tournament: 'HCL Squash Tour – Chennai 2024', result: 'Round of 16', points: 9, expires: '2025-06-07' },
  { date: '2024-05-26', tournament: 'HCL Squash Tour – Indore 2024', result: 'Round of 16', points: 9, expires: '2025-05-25' },
  { date: '2024-05-12', tournament: 'LTD Open Squash Tournament 2024', result: 'Quarter-finalist', points: 15, expires: '2025-05-11' },
  { date: '2024-04-27', tournament: 'Hamdard Squashters Northern Slam 2024', result: 'Round of 16', points: 9, expires: '2025-04-26' },
  { date: '2024-04-21', tournament: 'ACE PSA WSF Satellite #2 2024', result: 'Round of 16', points: 4.5, expires: '2025-04-20' },
  { date: '2024-01-17', tournament: 'JSW Willingdon Little Masters & Senior Tournament 2024', result: 'Round of 16', points: 9, expires: '2025-01-15' },
  { date: '2023-12-10', tournament: '43rd Senior Nationals (Sri Lanka) Squash Championship 2023', result: 'Quarter-finalist', points: 12.5, expires: '2024-12-08' },
  { date: '2023-12-03', tournament: 'Prince of Wales PSA Satellite 2023', result: 'Round of 16', points: 4.5, expires: '2024-12-01' },
  { date: '2023-11-26', tournament: 'PSA WSF Satellite 5 2023', result: 'Quarter-finalist', points: 7.5, expires: '2024-11-24' },
  { date: '2023-11-10', tournament: 'Ace Malaysia Cup Satellite 2023', result: 'Round of 32', points: 2.75, expires: '2024-11-08' },
  { date: '2023-10-22', tournament: 'PSA WSF Satellite 4 2023', result: 'Round of 16', points: 4.5, expires: '2024-10-20' },
  { date: '2023-09-30', tournament: '3rd Bangabandhu Squash Tournament 2023 Presented by Ispahani', result: 'Round of 16', points: 15, expires: '2024-09-28' },
];

export const MEDICAL_ZEROS: MedicalZero[] = [
  { date: '2026-08-10', tournament: 'China Squash Tour Challenger #1 2026', expires: '2027-08-09', status: 'Active' },
  { date: '2025-06-08', tournament: 'WA Open International 2025', expires: '2026-06-07', status: 'Expired' },
  { date: '2024-10-31', tournament: 'Philippine Challenger Classic 2024', expires: '2025-10-30', status: 'Expired' },
];

// Intentionally separate from empty divisor places and medical zeros.
// The checked PSA publications currently contain no other ranking-zero entries.
export const RANKING_ZEROS: RankingZero[] = [];

// PSA labels these as “No penalty”. They are not medical zeros, do not add points,
// and do not have a ranking-points expiry date.
export const NO_PENALTY_WITHDRAWALS: NoPenaltyWithdrawal[] = [
  { startDate: '2026-09-09', endDate: '2026-09-13', tournament: 'Maspeth Welding Intsel Steel Court Championship 2026' },
  { startDate: '2026-03-26', endDate: '2026-03-29', tournament: '2025–2026 World Championship Qualifying Event – Oceania' },
  { startDate: '2026-03-18', endDate: '2026-03-22', tournament: 'JSW Indian Open 2026' },
  { startDate: '2025-10-19', endDate: '2025-10-25', tournament: 'Comcast Business U.S. Open 2025' },
  { startDate: '2025-09-28', endDate: '2025-10-04', tournament: 'QTerminals Qatar Classic 2025' },
  { startDate: '2025-06-26', endDate: '2025-06-29', tournament: 'City of Greater Bendigo International 2025' },
  { startDate: '2024-10-30', endDate: '2024-11-03', tournament: 'Costa North Coast Open 2024' },
  { startDate: '2024-10-01', endDate: '2024-10-05', tournament: 'Ispahani 4th Bangladesh Open Squash Tournament 2024' },
  { startDate: '2023-11-06', endDate: '2023-11-10', tournament: 'Ace Malaysia Squash Cup 2023' },
];
