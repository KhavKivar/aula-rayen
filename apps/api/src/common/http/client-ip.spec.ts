import { getClientIp } from './client-ip';

describe('getClientIp', () => {
  it('prefers the Cloudflare header over req.ip', () => {
    expect(
      getClientIp({
        headers: { 'cf-connecting-ip': '203.0.113.10' },
        ip: '10.0.0.1',
      }),
    ).toBe('203.0.113.10');
  });

  it('uses the first value when the header arrives repeated', () => {
    expect(
      getClientIp({
        headers: { 'cf-connecting-ip': ['203.0.113.10', '203.0.113.11'] },
        ip: '10.0.0.1',
      }),
    ).toBe('203.0.113.10');
  });

  it('falls back to req.ip without the Cloudflare header', () => {
    expect(getClientIp({ headers: {}, ip: '198.51.100.7' })).toBe(
      '198.51.100.7',
    );
  });

  it('returns unknown when no client address is available', () => {
    expect(getClientIp({ headers: {}, ip: undefined })).toBe('unknown');
    expect(getClientIp({})).toBe('unknown');
  });
});
