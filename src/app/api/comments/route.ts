import { get, head, list, put } from '@vercel/blob';
import { createHash, createHmac, randomUUID } from 'node:crypto';
import {
  articleCommentKey,
  COMMENT_BODY_LIMIT,
  COMMENT_NAME_LIMIT,
  START_SATELLITE_ARTICLE,
  type ArticleComment,
} from '@/lib/article-comments';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const MAX_REQUEST_BYTES = 8192;

function articlePrefix(article: string) {
  return 'article-comments/' + createHash('sha256').update(article).digest('hex') + '/';
}

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const article = params.get('article');
  if (!article || article.length > 2048) return error('Invalid article.', 400);

  try {
    const prefix = articlePrefix(article);
    const { blobs, cursor, hasMore } = await list({
      prefix,
      limit: 15,
      cursor: params.get('cursor') || undefined,
    });
    const comments = await Promise.all(blobs.filter(({ pathname }) => pathname.startsWith(prefix)).map(async ({ pathname }) => {
      const blob = await get(pathname, { access: 'private', useCache: false });
      if (!blob || blob.statusCode !== 200) return null;
      return new Response(blob.stream).json() as Promise<ArticleComment>;
    }));
    return Response.json({
      comments: comments.filter((comment) => comment !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      cursor: hasMore ? cursor : null,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return error('Comments are temporarily unavailable.', 503);
  }
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json') ||
      request.headers.get('sec-fetch-site') === 'cross-site') {
    return error('Invalid request.', 400);
  }

  const reader = request.body?.getReader();
  if (!reader) return error('Invalid request.', 400);
  let size = 0;
  const decoder = new TextDecoder();
  let input = '';
  let data;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return error('Comment is too large.', 413);
      }
      input += decoder.decode(value, { stream: true });
    }
    data = JSON.parse(input + decoder.decode());
  } catch {
    return error('Invalid request.', 400);
  }

  const { article, website } = data ?? {};
  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const body = typeof data?.body === 'string' ? data.body.trim() : '';
  if (typeof article !== 'string' || !article || article.length > 2048 ||
      !name || name.length > COMMENT_NAME_LIMIT || !body || body.length > COMMENT_BODY_LIMIT) {
    return error('Enter a name and a comment within the character limits.', 400);
  }
  if (website) return error('Your comment could not be accepted.', 400);

  try {
    if (article !== START_SATELLITE_ARTICLE) {
      const workbook = await fetchWorkbook();
      const exists = getSheetRows(workbook, 'Articles').some((item) =>
        String(item.category ?? '').trim().toLowerCase() === 'recent update' &&
        String(item.title ?? '').trim() &&
        articleCommentKey(String(item.url ?? '').trim()) === article,
      );
      if (!exists) return error('This update is unavailable.', 404);
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return error('Comments are temporarily unavailable.', 503);
    const minute = Math.floor(Date.now() / 60_000);
    // One write per article and visitor per minute, enforced by the store.
    const visitor = request.headers.get('x-vercel-forwarded-for') || 'unknown';
    const fingerprint = createHmac('sha256', token)
      .update(JSON.stringify([article, minute, visitor]))
      .digest('hex').slice(0, 24);
    const order = String(9_999_999_999 - minute).padStart(10, '0');
    const comment = { id: randomUUID(), name, body, createdAt: new Date().toISOString() };
    const pathname = articlePrefix(article) + order + '-' + fingerprint + '.json';
    try {
      await put(pathname, JSON.stringify(comment), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: 'application/json',
      });
    } catch (failure) {
      if (await head(pathname).catch(() => null)) {
        return error('Please wait a minute before posting again.', 429);
      }
      throw failure;
    }
    return Response.json({ comment }, { status: 201 });
  } catch {
    return error('Your comment could not be saved right now. Please try again.', 503);
  }
}
