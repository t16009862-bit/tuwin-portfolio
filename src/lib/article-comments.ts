export const START_SATELLITE_ARTICLE = '/media/start-psa-satellite-2026';
export const COMMENT_NAME_LIMIT = 60;
export const COMMENT_BODY_LIMIT = 1000;

export function articleCommentKey(url: string) {
  try {
    const parsed = new URL(url, 'https://tuwinh.com');
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return '';
    const path = parsed.pathname.replace(/\/$/, '') || '/';
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    return (host === 'tuwinh.com' ? '' : host) + path + parsed.search;
  } catch {
    return '';
  }
}

export type ArticleComment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};
