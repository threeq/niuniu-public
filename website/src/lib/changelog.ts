import { marked } from 'marked';
import type { Locale } from './i18n';

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

const REPO = 'threeq/niuniu-public';
const API_URL = `https://api.github.com/repos/${REPO}/releases?per_page=30`;

interface FetchResult {
  releases: Release[];
  error: string | null;
}

// Fetched once per Astro build. Empty list with `error` message on failure
// (no token, network blip, GitHub rate limit, etc.) so a transient API hiccup
// doesn't break the website build — the page still renders, just with the
// error notice and whatever we have cached.
export async function fetchReleases(): Promise<FetchResult> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'niuniu-website-build',
      'Accept': 'application/vnd.github+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(API_URL, { headers });
    if (!res.ok) {
      return { releases: [], error: `GitHub API ${res.status} ${res.statusText}` };
    }
    const all = (await res.json()) as Release[];
    const releases = all
      .filter((r) => !r.draft)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return { releases, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { releases: [], error: msg };
  }
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
}

export function platformOf(filename: string, locale: Locale): string {
  const lower = filename.toLowerCase();
  if (lower.includes('windows')) return locale === 'zh' ? 'Windows' : 'Windows';
  if (lower.includes('darwin-arm64') || lower.includes('mac-arm64'))
    return locale === 'zh' ? 'macOS (Apple 芯片)' : 'macOS (Apple Silicon)';
  if (lower.includes('darwin-amd64') || lower.includes('mac-amd64') || lower.includes('darwin-x64'))
    return locale === 'zh' ? 'macOS (Intel)' : 'macOS (Intel)';
  if (lower.includes('linux')) return 'Linux';
  return filename;
}

export function formatSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const ZH_START = '<!-- niuniu-zh:start -->';
const ZH_END = '<!-- niuniu-zh:end -->';
const EN_START = '<!-- niuniu-en:start -->';
const EN_END = '<!-- niuniu-en:end -->';

// GitHub release bodies are author-controlled markdown; we render via `marked`
// and let `set:html` insert into the page. Trusted source — not user input.
//
// New release bodies wrap each language in <!-- niuniu-{zh,en}:start --> ... :end -->
// markers so we can show only the section matching the current locale. Old releases
// (pre-2026-05) have no markers and render as a single shared body.
export function renderBody(body: string, locale: Locale): string {
  if (!body.includes(ZH_START) && !body.includes(EN_START)) {
    return marked.parse(body, { breaks: true, gfm: true }) as string;
  }
  const start = locale === 'zh' ? ZH_START : EN_START;
  const end = locale === 'zh' ? ZH_END : EN_END;
  const startIdx = body.indexOf(start);
  const endIdx = body.indexOf(end);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    return marked.parse(body, { breaks: true, gfm: true }) as string;
  }
  const section = body.slice(startIdx + start.length, endIdx).trim();
  return marked.parse(section, { breaks: true, gfm: true }) as string;
}
