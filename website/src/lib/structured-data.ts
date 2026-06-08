import type { Locale } from '@/lib/i18n';

/**
 * schema.org JSON-LD builders.
 *
 * Pure functions so they can be unit-tested; `BaseLayout.astro` emits the
 * site-wide Organization + WebSite graph and pages pass page-specific schemas
 * (SoftwareApplication, TechArticle, BreadcrumbList) via the `structuredData`
 * prop. Helps both Google rich results and generative-engine (GEO) parsing.
 */

export type JsonLd = Record<string, unknown>;

/** Brand contact + identity, shared across schemas. */
const ORG_NAME = 'Niuniu';
const ORG_NAME_ZH = '牛牛';
const CONTACT_EMAIL = 'three3q@qq.com';
const GITHUB_URL = 'https://github.com/threeq/niuniu-public';

const orgId = (siteUrl: string) => `${siteUrl}/#organization`;
const websiteId = (siteUrl: string) => `${siteUrl}/#website`;

/** schema.org BCP-47 language tag for a locale. */
function inLanguage(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en-US';
}

export function organizationSchema(siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(siteUrl),
    name: ORG_NAME,
    alternateName: ORG_NAME_ZH,
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    email: CONTACT_EMAIL,
    sameAs: [GITHUB_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
    },
  };
}

export function websiteSchema(siteUrl: string, locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    name: locale === 'zh' ? `${ORG_NAME_ZH} ${ORG_NAME}` : ORG_NAME,
    url: siteUrl,
    inLanguage: inLanguage(locale),
    publisher: { '@id': orgId(siteUrl) },
  };
}

export function softwareApplicationSchema(siteUrl: string, locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: locale === 'zh' ? `${ORG_NAME_ZH} ${ORG_NAME}` : ORG_NAME,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Windows, Linux',
    url: siteUrl,
    publisher: { '@id': orgId(siteUrl) },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function techArticleSchema(opts: {
  siteUrl: string;
  url: string;
  title: string;
  description?: string;
  locale: Locale;
}): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.title,
    url: opts.url,
    inLanguage: inLanguage(opts.locale),
    isPartOf: { '@id': websiteId(opts.siteUrl) },
    publisher: { '@id': orgId(opts.siteUrl) },
  };
  if (opts.description) schema.description = opts.description;
  return schema;
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };
}
