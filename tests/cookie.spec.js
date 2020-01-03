/* eslint-disable */
import defaults from '../src/defaults';
import cookie, { Url } from '../src/cookie';

const href = 'http://somehost/url';
const hostname = 'somehost';
const protocol = 'http:';

const initialWindowLocation = global.window.location;

delete global.window.location;
global.window.location = {
  href,
  protocol,
  hostname,
};
const someUtms = '?utm_source=Google&utm_medium=web';
const utms = '?utm_source=Google&utm_medium=web&utm_term=test&utm_content=onLoadPage&utm_campaign=testing';
const utm = 'utm_content';
const utmValue = 'onLoadPage';

describe('cookie tests', () => {
  afterAll(() => {
    delete global.window.location;
    global.window.location = initialWindowLocation;
  });

  describe('Url methods', () => {
    describe('getParameterByName method', () => {
      test('when we are not passing a url and current window.location.href not have params', () => {
        expect(Url.getParameterByName(utm)).toBe(null);
      });

      test('when we are not passing a url and current window.location.href have params', () => {
        global.window.location.href = href + utms;
        expect(Url.getParameterByName(utm)).toBe(utmValue);
      });

      test('when we are passing a url that not contains utms params', () => {
        expect(Url.getParameterByName(utm, href)).toBe(null);
      });

      test('when we are passing a url that contains utms params', () => {
        const url = href + utms;
        expect(Url.getParameterByName(utm, url)).toBe(utmValue);
      });

      test('when we are passing a url that contains some wrong params', () => {
        const url = href + someUtms + '&utm_term=&&&utm_content';
        expect(Url.getParameterByName(utm, url)).toBe('');
      });
    });

    describe('externalHost method', () => {
      test('When we are passing a external link with another hostname, and are using "http" protocol', () => {
        const externalLink = {
          hostname: 'anotherhost',
          protocol: protocol,
        };
        expect(Url.externalHost(externalLink)).toBe(true);
      });

      test('When we are passing a external link with the same hostname, and are using "http" protocol', () => {
        const externalLink = {
          hostname: hostname,
          protocol: protocol,
        };
        expect(Url.externalHost(externalLink)).toBe(false);
      });

      test('When we are passing a external link with the same hostname and "https" protocol', () => {
        const externalLink = {
          hostname: hostname,
          protocol: 'https:',
        };
        expect(Url.externalHost(externalLink)).toBe(false);
      });

      test('When we are passing a external link with another hostname and "https" protocol', () => {
        const externalLink = {
          hostname: 'anotherhost',
          protocol: 'https:',
        };
        expect(Url.externalHost(externalLink)).toBe(true);
      });
    });
  });

  describe('cookie methods', () => {
    const cookieName = 'test1';
    const cookieValue = '1';

    describe('set method', () => {
      test('passing only required params', () => {
        cookie.set(cookieName, cookieValue);
        expect(global.document.cookie).toContain(`${defaults.cookiePrefix + cookieName}=${cookieValue}`);

      });

      test('passing minutes', () => {
        const name = 'test2';
        const value = '2';
        cookie.set(name, value, 60);
        expect(global.document.cookie).toContain(`${defaults.cookiePrefix + name}=${value}`);
      });

      test('passing minutes and path equal to "/"', () => {
        const name = 'test3';
        const value = '3';
        cookie.set(name, value, 60, '/');
        expect(global.document.cookie).toContain(`${defaults.cookiePrefix + name}=${value}`);
      });

      test('When we are passing a path different to "/" does not set the cookie on current one', () => {
        const name = 'test4';
        const value = '4';
        cookie.set(name, value, 60, '/some/path');
        expect(global.document.cookie).not.toContain(`${defaults.cookiePrefix + name}=${value}`);
      });
    });

    describe('get method', () => {
      test('when we are passing a existing name of cookie', () => {
        expect(cookie.get(cookieName)).toEqual(cookieValue);
      });

      test('when we are passing a NOT existing name of cookie', () => {
        expect(cookie.get('someName')).toEqual('');
      });
    });

    describe('setUtms method', () => {
      test('when we doest NOT have utms on window.location.href', () => {
        global.window.location.href = href;
        cookie.setUtms();
        expect(cookie.get('utm')).toEqual('');
      });

      test('when we have some utms on window.location.href', () => {
        global.window.location.href = href + someUtms;
        cookie.setUtms();
        const utmCookie = cookie.get('utm');
        expect(utmCookie).toContain('utm_source');
        expect(utmCookie).toContain('utm_medium');
      });

      test('when we have utms on window.location.href', () => {
        global.window.location.href = href + utms;
        cookie.setUtms();
        const utmCookie = cookie.get('utm');
        expect(utmCookie).toContain('utm_source');
        expect(utmCookie).toContain('utm_medium');
        expect(utmCookie).toContain('utm_term');
        expect(utmCookie).toContain('utm_content');
        expect(utmCookie).toContain('utm_campaign');
        expect(utmCookie).toContain(utmValue);
      });
    });
  });
});