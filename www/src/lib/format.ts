export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function excerpt(markdown: string | undefined, maxLen = 160): string {
  if (!markdown) return '';
  return markdown
    .replace(/^#+\s+.*$/gm, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/:[a-z]+\[([^\]]*)\]/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear()).slice(-2);
  return `${d}/${m}/${y}`;
}

export function formatListItem(
  date: Date,
  url: string,
  title: string,
  options?: { pinned?: boolean; suffix?: string }
): string {
  const pinnedBadge = options?.pinned ? ' [pinned]' : '';
  const suffix = options?.suffix ? ` ${options.suffix}` : '';
  return `<span class="list-meta"><span class="muted">${formatDate(date)}</span></span><span class="entry-content"><a href="${url}" title="${title}">${title}</a>${pinnedBadge}${suffix}</span>`;
}

interface Sortable {
  date: Date;
  pinned?: boolean;
}

export function sortEntries<T>(items: T[], key?: (item: T) => Sortable): T[] {
  const get = key ?? (item => item as unknown as Sortable);
  return items.slice().sort((a, b) => {
    const ak = get(a), bk = get(b);
    if (ak.pinned && !bk.pinned) return -1;
    if (!ak.pinned && bk.pinned) return 1;
    return bk.date.getTime() - ak.date.getTime();
  });
}
