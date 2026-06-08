import { describe, expect, it } from 'vitest';
import { isProductionHost, shouldLoadAnalytics } from '@/lib/analytics';

describe('isProductionHost', () => {
  it('accepts the production domain (www + apex)', () => {
    expect(isProductionHost('www.niu6ai.com')).toBe(true);
    expect(isProductionHost('niu6ai.com')).toBe(true);
  });
  it('rejects localhost, loopback, preview and other hosts', () => {
    expect(isProductionHost('localhost')).toBe(false);
    expect(isProductionHost('127.0.0.1')).toBe(false);
    expect(isProductionHost('staging.niu6ai.com')).toBe(false);
    expect(isProductionHost('deploy-preview.example.com')).toBe(false);
    expect(isProductionHost('')).toBe(false);
  });
});

describe('shouldLoadAnalytics', () => {
  it('loads for a normal production visitor', () => {
    expect(shouldLoadAnalytics({ hostname: 'www.niu6ai.com' })).toBe(true);
    expect(shouldLoadAnalytics({ hostname: 'www.niu6ai.com', doNotTrack: '0' })).toBe(true);
    expect(
      shouldLoadAnalytics({
        hostname: 'www.niu6ai.com',
        doNotTrack: 'unspecified',
        globalPrivacyControl: false,
      }),
    ).toBe(true);
  });

  it('does not load on non-production hosts (local dev / preview)', () => {
    expect(shouldLoadAnalytics({ hostname: 'localhost' })).toBe(false);
    expect(shouldLoadAnalytics({ hostname: 'staging.niu6ai.com' })).toBe(false);
  });

  it('honors Do Not Track ("1" / "yes")', () => {
    expect(shouldLoadAnalytics({ hostname: 'www.niu6ai.com', doNotTrack: '1' })).toBe(false);
    expect(shouldLoadAnalytics({ hostname: 'www.niu6ai.com', doNotTrack: 'yes' })).toBe(false);
  });

  it('honors Global Privacy Control', () => {
    expect(shouldLoadAnalytics({ hostname: 'www.niu6ai.com', globalPrivacyControl: true })).toBe(
      false,
    );
  });

  it('host gate and privacy opt-out compose (either one blocks)', () => {
    expect(shouldLoadAnalytics({ hostname: 'localhost', globalPrivacyControl: false })).toBe(false);
    expect(shouldLoadAnalytics({ hostname: 'www.niu6ai.com', globalPrivacyControl: true })).toBe(
      false,
    );
  });
});
