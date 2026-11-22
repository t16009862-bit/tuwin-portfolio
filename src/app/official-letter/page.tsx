import Link from 'next/link';

const pdfPath = '/colombo-junior-squash-championship-2026-appreciation.pdf';

export const metadata = {
  title: 'Official Letter of Appreciation | Tuwin Herath',
  description: 'Official recognition from Sri Lanka Squash for the Colombo Junior Squash Championship 2026.',
};

export default function OfficialLetterPage() {
  return (
    <main className="min-h-screen bg-[#06070a] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/#about" className="text-sm text-cyan-accent hover:underline">
          ← Return to website
        </Link>
        <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-accent">Sri Lanka Squash</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-4xl">Official Letter of Appreciation</h1>
            <p className="mt-2 text-sm text-slate-300">Colombo Junior Squash Championship 2026</p>
          </div>
          <a href={pdfPath} download="Sri-Lanka-Squash-Official-Letter-of-Appreciation.pdf"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-cyan-accent px-5 py-3 text-sm font-bold text-black">
            Download original letter (PDF)
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/15 bg-white">
          <iframe
            src={pdfPath + '#toolbar=1&view=FitH'}
            title="Original Sri Lanka Squash letter of appreciation"
            className="block h-[75vh] min-h-[500px] w-full"
          />
        </div>
        <p className="mt-4 text-sm text-slate-300">
          If your browser displays a blank PDF preview, use <a href={pdfPath} download="Sri-Lanka-Squash-Official-Letter-of-Appreciation.pdf" className="font-semibold text-cyan-accent underline">Download original letter</a> above. The downloaded document is unchanged.
        </p>
      </div>
    </main>
  );
}
