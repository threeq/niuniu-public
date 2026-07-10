import { describe, expect, it } from 'vitest';
import { parseUtm, hasUtm, UTM_KEYS } from '@/lib/utm';

describe('parseUtm', () => {
  it('extracts all five UTM fields from a query string', () => {
    const u = parseUtm(
      '?utm_source=google&utm_medium=cpc&utm_campaign=launch&utm_term=niuniu&utm_content=hero',
    );
    expect(u).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'launch',
      utm_term: 'niuniu',
      utm_content: 'hero',
    });
  });

  it('works with or without a leading "?"', () => {
    expect(parseUtm('utm_source=x').utm_source).toBe('x');
    expect(parseUtm('?utm_source=x').utm_source).toBe('x');
  });

  it('defaults missing fields to empty string and trims values', () => {
    const u = parseUtm('?utm_source=%20mail%20&other=ignored');
    expect(u.utm_source).toBe('mail');
    expect(u.utm_medium).toBe('');
    expect(u.utm_campaign).toBe('');
    expect(u.utm_term).toBe('');
    expect(u.utm_content).toBe('');
  });

  it('returns all-empty for an empty query', () => {
    const u = parseUtm('');
    for (const k of UTM_KEYS) expect(u[k]).toBe('');
  });

  it('ignores non-UTM params entirely', () => {
    const u = parseUtm('?ref=abc&gclid=123');
    expect(hasUtm(u)).toBe(false);
  });
});

describe('hasUtm', () => {
  it('is true when any field is non-empty', () => {
    expect(hasUtm(parseUtm('?utm_medium=email'))).toBe(true);
    expect(hasUtm(parseUtm('?utm_content=footer'))).toBe(true);
  });

  it('is false when every field is empty', () => {
    expect(hasUtm(parseUtm(''))).toBe(false);
    expect(hasUtm(parseUtm('?foo=bar'))).toBe(false);
  });
});
