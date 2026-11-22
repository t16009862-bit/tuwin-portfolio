'use client';

import { useCallback, useEffect, useId, useState, type FormEvent } from 'react';
import { COMMENT_BODY_LIMIT, COMMENT_NAME_LIMIT, type ArticleComment } from '@/lib/article-comments';

function CommentThread({ article }: { article: string }) {
  const id = useId();
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [posting, setPosting] = useState(false);
  const [postMessage, setPostMessage] = useState('');

  const load = useCallback(async (next: string | null, signal?: AbortSignal) => {
    const params = new URLSearchParams({ article });
    if (next) params.set('cursor', next);
    try {
      const response = await fetch('/api/comments?' + params, { signal, cache: 'no-store' });
      if (!response.ok) throw new Error();
      if (signal?.aborted) return;
      const result = await response.json() as { comments: ArticleComment[]; cursor: string | null };
      setComments((previous) => Array.from(
        new Map([...previous, ...result.comments].map((comment) => [comment.id, comment])).values(),
      ).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setCursor(result.cursor);
      setLoaded(true);
    } catch {
      if (!signal?.aborted) setListError('Comments could not be loaded.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [article]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void load(null, controller.signal);
    });
    return () => controller.abort();
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (posting) return;
    const form = event.currentTarget;
    const { name, body, website } = Object.fromEntries(new FormData(form));
    setPosting(true);
    setPostMessage('');
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, name, body, website }),
      });
      const result = await response.json();
      if (!response.ok) {
        setPostMessage(result.error || 'Your comment could not be posted.');
        return;
      }
      setComments((items) => [result.comment, ...items.filter((item) => item.id !== result.comment.id)]);
      form.reset();
      setPostMessage('Comment posted.');
    } catch {
      setPostMessage('Your comment could not be posted. Please try again.');
    } finally {
      setPosting(false);
    }
  }

  const fieldStyle = 'mt-1 block w-full rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none';
  return (
    <div className="space-y-5 text-sm">
      <form onSubmit={submit} className="space-y-3">
        <p className="text-slate-400">Your name and comment will be public.</p>
        <label htmlFor={id + '-name'} className="block text-slate-200">
          Name
          <input id={id + '-name'} name="name" autoComplete="nickname" required maxLength={COMMENT_NAME_LIMIT} className={fieldStyle} />
        </label>
        <label htmlFor={id + '-body'} className="block text-slate-200">
          Comment
          <textarea id={id + '-body'} name="body" required rows={3} maxLength={COMMENT_BODY_LIMIT} className={fieldStyle} />
        </label>
        <div hidden><input name="website" tabIndex={-1} autoComplete="off" /></div>
        <button type="submit" disabled={posting} className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">
          {posting ? 'Posting…' : 'Post comment'}
        </button>
        <p role="status" className="text-slate-300">{postMessage}</p>
      </form>
      {!!comments.length && (
        <ol className="divide-y divide-white/10 border-t border-white/10">
          {comments.map((comment) => (
            <li key={comment.id} className="py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="break-all font-semibold text-white">{comment.name}</span>
                <time dateTime={comment.createdAt} className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-slate-200">{comment.body}</p>
            </li>
          ))}
        </ol>
      )}
      {loaded && !comments.length && <p className="text-slate-400">Be the first to comment.</p>}
      {loading && <p role="status" className="text-slate-400">Loading comments…</p>}
      {listError && <p role="status" className="text-slate-300">{listError}</p>}
      {!loading && (cursor || listError) && (
        <button type="button" onClick={() => {
          setLoading(true);
          setListError('');
          void load(cursor);
        }} className="font-semibold text-cyan-300 hover:underline">
          {listError ? 'Try again' : 'Load older comments'}
        </button>
      )}
    </div>
  );
}

export default function ArticleComments({ article, compact = false }: { article: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  if (!article) return null;
  if (compact) {
    return (
      <details className="mt-4 border-t border-white/10 pt-3" onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-white">Comments</summary>
        {open && <div className="mt-4"><CommentThread key={article} article={article} /></div>}
      </details>
    );
  }
  return (
    <section id="comments" aria-labelledby="comments-heading" className="mt-12 scroll-mt-6 border-t border-white/10 pt-8">
      <h2 id="comments-heading" className="mb-5 text-2xl font-bold text-white">Comments</h2>
      <CommentThread key={article} article={article} />
    </section>
  );
}
