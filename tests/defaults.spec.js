import defaults from '../src/defaults';

describe('defaults', () => {
  test('accountId is null', () => {
    expect(defaults.accountId).toBe(null);
  });

  test('cookiePrefix is "_iris_"', () => {
    expect(defaults.cookiePrefix).toBe('_iris_');
  });

  test('targetUrl is "https://www.example.com/iris.gif"', () => {
    expect(defaults.targetUrl).toBe('https://www.example.com/iris.gif');
  });

  test('useBeacon is true', () => {
    expect(defaults.useBeacon).toBe(true);
  });
});
