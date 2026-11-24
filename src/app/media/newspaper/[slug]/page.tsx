import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

export const dynamic = 'force-dynamic';

type NewspaperRow = Record<string, unknown>;

const textValue = (value: unknown) => String(value ?? '').trim();

function newspaperDate(value: unknown): string {
  if (typeof value === 'number') {
    return new Date(Date.UTC(1899, 11, 30) + value * 86400000).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });
  }
  const date = new Date(textValue(value));
  if (Number.isNaN(date.getTime())) return textValue(value);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

export default async function NewspaperArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article: NewspaperRow | undefined;

  try {
    const workbook = await fetchWorkbook();
    const rows = getSheetRows<NewspaperRow>(workbook, 'Articles');
    article = rows.find((row) => textValue(row.article_slug) === slug && Boolean(textValue(row.image_url)));
  } catch {
    return (
      <main className="min-h-screen bg-[#06070a] px-5 py-20 text-center text-white">
        <h1 className="text-2xl font-bold">Newspaper archive temporarily unavailable</h1>
        <p className="mt-4 text-slate-300">The original clipping is preserved in the media archive.</p>
        <Link href="/media" className="mt-6 inline-block text-cyan-accent underline">Back to Media &amp; Press</Link>
      </main>
    );
  }

  if (!article) notFound();
  const title = textValue(article.title);
  const source = textValue(article.source);
  const date = newspaperDate(article.date);
  const printImage = textValue(article.image_url);
  const epaperImage = textValue(article.epaper_image_url);
  const editions = epaperImage
    ? [
        { id: 'print', label: 'Print edition', image: printImage },
        { id: 'epaper', label: 'ePaper edition', image: epaperImage },
      ]
    : [{ id: 'print', label: 'Original newspaper clipping', image: printImage }];

  return (
    <main className="min-h-screen bg-[#06070a] px-4 py-10 text-white sm:px-7">
      <article className="mx-auto max-w-5xl">
        <Link href="/media" className="text-sm text-cyan-accent hover:underline">
          ← Media &amp; Press
        </Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-cyan-accent">Newspaper Archive</p>
        <h1 className="mt-3 text-2xl font-black leading-tight sm:text-4xl">{title}</h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
          <span>{source}</span><span>·</span><time>{date}</time>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">{textValue(article.description)}</p>
        <div className="mt-7 flex flex-wrap gap-4">
          {editions.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex items-center rounded-full bg-cyan-accent px-5 py-3 text-xs font-bold uppercase tracking-widest text-black"
            >
              View {label}
            </a>
          ))}
        </div>
        {editions.map(({ id, label, image }) => (
          <section key={id} id={id} className="mt-10 scroll-mt-6" aria-labelledby={`${id}-title`}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`${id}-title`} className="text-xl font-bold">{label}</h2>
              <a href={image} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-accent underline">
                Open full-size image
              </a>
            </div>
            <figure className="overflow-hidden rounded-xl border border-white/15 bg-white p-2 shadow-2xl sm:p-4">
              <img src={image} alt={`${label}: ${title}`} className="mx-auto block h-auto max-h-[1500px] w-auto max-w-full object-contain" />
            </figure>
          </section>
        ))}
      </article>
    </main>
  );
}
