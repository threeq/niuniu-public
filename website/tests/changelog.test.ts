import { describe, it, expect } from 'vitest';
import { renderBody } from '@/lib/changelog';

describe('renderBody', () => {
  it('renders entire body when no locale markers (legacy releases)', () => {
    const body = '### Features\n- something\n';
    const zhOut = renderBody(body, 'zh');
    const enOut = renderBody(body, 'en');
    expect(zhOut).toContain('something');
    expect(enOut).toContain('something');
    // Both locales render the same legacy body
    expect(zhOut).toBe(enOut);
  });

  it('renders only the zh block when locale=zh', () => {
    const body = [
      '<!-- niuniu-zh:start -->',
      '## ✨ 本版本亮点',
      '中文摘要',
      '<!-- niuniu-zh:end -->',
      '',
      '<!-- niuniu-en:start -->',
      '## ✨ Highlights',
      'English summary',
      '<!-- niuniu-en:end -->',
    ].join('\n');
    const zhOut = renderBody(body, 'zh');
    expect(zhOut).toContain('本版本亮点');
    expect(zhOut).toContain('中文摘要');
    expect(zhOut).not.toContain('Highlights');
    expect(zhOut).not.toContain('English summary');
  });

  it('renders only the en block when locale=en', () => {
    const body = [
      '<!-- niuniu-zh:start -->',
      '## ✨ 本版本亮点',
      '中文摘要',
      '<!-- niuniu-zh:end -->',
      '',
      '<!-- niuniu-en:start -->',
      '## ✨ Highlights',
      'English summary',
      '<!-- niuniu-en:end -->',
    ].join('\n');
    const enOut = renderBody(body, 'en');
    expect(enOut).toContain('Highlights');
    expect(enOut).toContain('English summary');
    expect(enOut).not.toContain('本版本亮点');
    expect(enOut).not.toContain('中文摘要');
  });

  it('falls back to full render when only one locale marker is present', () => {
    const body = [
      '<!-- niuniu-zh:start -->',
      'only zh',
      '<!-- niuniu-zh:end -->',
    ].join('\n');
    const enOut = renderBody(body, 'en');
    expect(enOut).toContain('only zh');
  });

  it('falls back to full render when markers are out of order', () => {
    const body = [
      '<!-- niuniu-zh:end -->',
      'broken',
      '<!-- niuniu-zh:start -->',
      '<!-- niuniu-en:start -->',
      'also broken',
      '<!-- niuniu-en:end -->',
    ].join('\n');
    const zhOut = renderBody(body, 'zh');
    expect(zhOut).toContain('broken');
  });
});
