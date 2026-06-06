import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export type DocEntry = CollectionEntry<'docs-zh'> | CollectionEntry<'docs-en'>;

const groupOrder = ['intro', 'install', 'concepts', 'guides', 'faq'] as const;

export async function getDocsForLocale(locale: Locale): Promise<DocEntry[]> {
  const collection = locale === 'zh' ? 'docs-zh' : 'docs-en';
  const all = await getCollection(collection, ({ data }) => !data.draft);
  return all.sort((a, b) => {
    const ga = groupOrder.indexOf(a.data.group as (typeof groupOrder)[number]);
    const gb = groupOrder.indexOf(b.data.group as (typeof groupOrder)[number]);
    if (ga !== gb) return ga - gb;
    return a.data.order - b.data.order;
  });
}

export interface NavGroup {
  group: (typeof groupOrder)[number];
  items: { slug: string; title: string }[];
}

export function buildNav(docs: DocEntry[]): NavGroup[] {
  const result: NavGroup[] = groupOrder.map((g) => ({ group: g, items: [] }));
  for (const doc of docs) {
    const slot = result.find((r) => r.group === doc.data.group);
    if (slot) slot.items.push({ slug: doc.id, title: doc.data.title });
  }
  return result.filter((r) => r.items.length > 0);
}

export function findPrevNext(docs: DocEntry[], currentSlug: string) {
  const idx = docs.findIndex((d) => d.id === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? docs[idx - 1] : null,
    next: idx < docs.length - 1 ? docs[idx + 1] : null,
  };
}
