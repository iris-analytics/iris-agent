import { clear, mockUserAgent } from 'jest-useragent-mock';
import browser from '../src/browser';

describe('browser tests', () => {
  describe('nameAndVersion method', () => {
    afterEach(() => {
      clear();
    });
    test('When we are passing a non existing userAgent', () => {
      const userAgent = 'Some invented user agent';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('Netscape 4.0 -?');
    });

    test('When userAgent type is "trident"', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('IE 11');
    });

    test('When userAgent type is "trident" but not have "rv" value to specify the version', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0;) like Gecko';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('IE ');
    });

    test('When userAgent type is "chrome"', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('Chrome 74');
    });

    test('When userAgent type is "chrome" and is "OPR" opera too', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/65.0.3467.42';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('Opera 65');
    });

    test('When userAgent type is "firefox"', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:70.0) Gecko/20100101 Firefox/70.0';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('Firefox 70');
    });

    test('When userAgent is from a mobile device with concrete version', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36';
      mockUserAgent(userAgent);
      expect(browser.nameAndVersion()).toEqual('Chrome 4');
    });
  });

  describe('isMobile method', () => {
    test('When document NOT contains "ontouchstart" means that we are NOT on mobile', () => {
      expect(browser.isMobile()).toBe(false);
    });

    test('When document contains "ontouchstart" means that we are on mobile', () => {
      document.ontouchstart = jest.fn();
      expect(browser.isMobile()).toBe(true);
      document.ontouchstart = undefined;
    });
  });

  describe('userAgent method', () => {
    test('We expect receive the current userAgent', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
      mockUserAgent(userAgent);
      expect(browser.userAgent()).toEqual(userAgent);
      clear();
    });
  });
});
