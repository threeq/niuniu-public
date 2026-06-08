import { describe, expect, it } from 'vitest';
import { shouldLoadAnalytics } from '@/lib/analytics';

describe('shouldLoadAnalytics', () => {
  it('loads for a normal visitor', () => {
    expect(shouldLoadAnalytics({})).toBe(true);
    expect(shouldLoadAnalytics({ doNotTrack: '0' })).toBe(true);
    expect(shouldLoadAnalytics({ doNotTrack: 'unspecified', globalPrivacyControl: false })).toBe(
      true,
    );
  });

  it('honors Do Not Track ("1" / "yes")', () => {
    expect(shouldLoadAnalytics({ doNotTrack: '1' })).toBe(false);
    expect(shouldLoadAnalytics({ doNotTrack: 'yes' })).toBe(false);
  });

  it('honors Global Privacy Control', () => {
    expect(shouldLoadAnalytics({ globalPrivacyControl: true })).toBe(false);
  });

  it('GPC takes precedence even when DNT is unset', () => {
    expect(shouldLoadAnalytics({ doNotTrack: null, globalPrivacyControl: true })).toBe(false);
  });
});
