import Link from 'next/link';

export const metadata = {
  title: 'Tuwin Herath Shines in India as Shamil Wakeel Claims PSA Satellite Title | Tuwin Herath',
  description: 'Sri Lankan squash players Shamil Wakeel and Tuwin Osanda Herath finish first and third at the START PSA Satellite in Mumbai, India.',
};

export default function StartSatellitePressRelease() {
  return (
    <main className="min-h-screen bg-[#06070a] px-6 py-12 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/media" className="text-sm text-cyan-400 hover:underline">← Media & Press</Link>
        <p className="mt-12 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Official Press Release · 22 November 2026</p>
        <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">Tuwin Herath Shines in India as Shamil Wakeel Claims PSA Satellite Title</h1>
        <p className="mt-6 text-sm text-slate-400">Mumbai, India</p>
        <figure className="mx-auto mt-8 max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#101923]">
          {/* Original tournament photograph. */}
          <img
            src="/media/start-psa-satellite-2026/photo"
            alt="Tuwin Herath (left) and PSA Satellite champion Shamil Wakeel (right) together at the tournament in India"
            width={240}
            height={320}
            className="block h-auto w-full"
          />
          <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-300">
            Tuwin Osanda Herath (left) and champion Shamil Wakeel (right) at the START PSA Satellite in India.
          </figcaption>
        </figure>
        <div className="mt-10 space-y-6 text-base leading-8 text-slate-200">
          <p>Sri Lankan squash player <strong>Shamil Wakeel</strong> emerged champion at the START PSA Satellite tournament in Mumbai, India, while fellow Sri Lankan <strong>Tuwin Osanda Herath</strong> secured third place.</p>
          <p>Wakeel delivered a strong tournament performance to claim the championship title. Herath also demonstrated resilience, including a closely contested five-game match in which he recovered from 5–10 down in the deciding game to level at 10–10 before narrowly losing.</p>
          <p>The results underline the presence of Sri Lankan players on the Professional Squash Association (PSA) circuit.</p>
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">Tournament Results</h2>
          <p className="mt-4">Champion — Shamil Wakeel (Sri Lanka)</p>
          <p className="mt-2">Third Place — Tuwin Osanda Herath (Sri Lanka)</p>
        </div>
      </article>
    </main>
  );
}
