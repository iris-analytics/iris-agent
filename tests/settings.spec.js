import settings from '../src/settings';

describe('settings', () => {
  test('accountId is null', () => {
    expect(settings.accountId).toBe(null);
  });

  test('cookiePrefix is "_iris_"', () => {
    expect(settings.options.cookiePrefix).toBe('_iris_');
  });

  test('targetUrl is "/" by default', () => {
    expect(settings.options.targetUrl).toBe('/');
  });

  test('useBeacon is true', () => {
    expect(settings.options.useBeacon).toBe(true);
  });
});
