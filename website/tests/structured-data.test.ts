import { describe, expect, it } from 'vitest';
import {
  breadcrumbSchema,
  organizationSchema,
  softwareApplicationSchema,
  techArticleSchema,
  websiteSchema,
} from '@/lib/structured-data';

const SITE = 'https://www.niu6ai.com';

describe('organizationSchema', () => {
  const org = organizationSchema(SITE);
  it('is a JSON-LD Organization', () => {
    expect(org['@context']).toBe('https://schema.org');
    expect(org['@type']).toBe('Organization');
    expect(org.url).toBe(SITE);
  });
  it('carries an absolute logo URL', () => {
    expect(String(org.logo)).toMatch(/^https:\/\/www\.niu6ai\.com\//);
  });
  it('exposes the contact email and GitHub as sameAs', () => {
    const json = JSON.stringify(org);
    expect(json).toContain('three3q@qq.com');
    expect(json).toContain('https://github.com/threeq/niuniu-public');
  });
});

describe('websiteSchema', () => {
  it('sets inLanguage per locale', () => {
    expect(websiteSchema(SITE, 'zh').inLanguage).toBe('zh-CN');
    expect(websiteSchema(SITE, 'en').inLanguage).toBe('en-US');
  });
  it('is a WebSite linked to the organization as publisher', () => {
    const site = websiteSchema(SITE, 'zh');
    expect(site['@type']).toBe('WebSite');
    expect(JSON.stringify(site.publisher)).toContain('#organization');
  });
});

describe('softwareApplicationSchema', () => {
  const app = softwareApplicationSchema(SITE, 'zh');
  it('describes a cross-platform free developer app', () => {
    expect(app['@type']).toBe('SoftwareApplication');
    expect(String(app.operatingSystem)).toMatch(/macOS/);
    expect(String(app.operatingSystem)).toMatch(/Windows/);
    expect(String(app.operatingSystem)).toMatch(/Linux/);
    expect(app.applicationCategory).toBe('DeveloperApplication');
  });
  it('offers a free tier (price 0)', () => {
    const offers = app.offers as Record<string, unknown>;
    expect(offers['@type']).toBe('Offer');
    expect(String(offers.price)).toBe('0');
  });
});

describe('techArticleSchema', () => {
  const article = techArticleSchema({
    siteUrl: SITE,
    url: `${SITE}/docs/intro`,
    title: '介绍',
    description: '了解牛牛',
    locale: 'zh',
  });
  it('is a TechArticle with headline, url and language', () => {
    expect(article['@type']).toBe('TechArticle');
    expect(article.headline).toBe('介绍');
    expect(article.description).toBe('了解牛牛');
    expect(article.url).toBe(`${SITE}/docs/intro`);
    expect(article.inLanguage).toBe('zh-CN');
  });
  it('omits description when absent', () => {
    const a = techArticleSchema({ siteUrl: SITE, url: `${SITE}/docs/x`, title: 'X', locale: 'en' });
    expect('description' in a).toBe(false);
    expect(a.inLanguage).toBe('en-US');
  });
});

describe('breadcrumbSchema', () => {
  const crumb = breadcrumbSchema([
    { name: '首页', url: `${SITE}/` },
    { name: '文档', url: `${SITE}/docs/intro` },
    { name: '介绍', url: `${SITE}/docs/intro` },
  ]);
  it('is an ordered BreadcrumbList', () => {
    expect(crumb['@type']).toBe('BreadcrumbList');
    const items = crumb.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);
    expect(items[0].position).toBe(1);
    expect(items[2].position).toBe(3);
    expect(items[1].name).toBe('文档');
    expect(items[1].item).toBe(`${SITE}/docs/intro`);
  });
});
