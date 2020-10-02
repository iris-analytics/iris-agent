/* eslint-disable jest/no-standalone-expect */
import Iris, {
  ensureAndGetVisitorID,
  ensureAndGetSessionID,
  getContent,
  marshalData,
  getTargetUrl,
  sendBeacon,
  sendImage,
  init,
  fire,
} from '../src/index';
import cookie from '../src/cookie';
import settings from '../src/settings';
import browser from '../src/browser';

const generateCookieMOCK = (exist = false) => {
  if (exist) return jest.fn().mockReturnValue('testId');
  return jest.fn();
};

describe('index methods', () => {
  const eventType = 'pageload';
  const data = { foo: 1 };
  const attributes = getContent(eventType, marshalData(data));
  const backend = { targetUrl: 'http://iris-backend/recordevent.gif' };

  describe('id getters and generators', () => {
    beforeEach(() => {
      cookie.set = jest.fn();
      cookie.get = generateCookieMOCK();
    });

    describe('ensureAndGetVisitorID', () => {
      test('retrieves the uid from cookies', () => {
        ensureAndGetVisitorID();
        expect(cookie.get).toHaveBeenCalledTimes(1);
        expect(cookie.get).toHaveBeenCalledWith('uid');
      });

      test('Sets the correct expiration time for the UID cookie', () => {
        const uid = ensureAndGetVisitorID();
        expect(cookie.set).toHaveBeenCalledTimes(1);
        expect(cookie.set).toHaveBeenCalledWith('uid', uid, 1051200);
      });

      test('Uses the existing UID if exists', () => {
        cookie.get = generateCookieMOCK(true);
        const uid = ensureAndGetVisitorID();
        expect(uid).toBe('testId');
      });

      test('Generates a new UID if there is no one', () => {
        const uid = ensureAndGetVisitorID();
        expect(uid).toHaveLength(36);
      });
    });

    describe('ensureAndGetSessionID', () => {
      test('retrieves the sid from cookies', () => {
        ensureAndGetSessionID();
        expect(cookie.get).toHaveBeenCalledTimes(1);
        expect(cookie.get).toHaveBeenCalledWith('sid');
      });

      test('Sets the correct expiration time for the SID cookie', () => {
        const sid = ensureAndGetSessionID();
        expect(cookie.set).toHaveBeenCalledTimes(1);
        expect(cookie.set).toHaveBeenCalledWith('sid', sid, 30);
      });

      test('Uses the existing SID if exists', () => {
        cookie.get = generateCookieMOCK(true);
        const sid = ensureAndGetSessionID();
        expect(sid).toBe('testId');
      });

      test('Generates a new SID if there is no one', () => {
        cookie.get = generateCookieMOCK();
        const sid = ensureAndGetSessionID();
        expect(sid).toHaveLength(36);
      });
    });
  });

  describe('getContent', () => {
    global.window.screen = {
      ...global.screen,
      width: 100,
      height: 100,
    };
    const content = getContent('fake event type', 'some data');
    test('returns correct id', () => {
      expect(content.id).toBe(settings.accountId);
    });

    test('returns correct uid', () => {
      expect(cookie.get).toHaveBeenCalledTimes(1);
      expect(cookie.get).toHaveBeenCalledWith('sid');
      expect(content.uid).toHaveLength(36);
    });

    test('returns correct sid', () => {
      expect(cookie.get).toHaveBeenCalledTimes(1);
      expect(cookie.get).toHaveBeenCalledWith('sid');
      expect(content.sid).toHaveLength(36);
    });

    test('returns correct ev', () => {
      expect(content.ev).toBe('fake event type');
    });

    test('returns correct ed', () => {
      expect(content.ed).toBe('some data');
    });

    test('returns correct dl', () => {
      expect(content.dl).toBe(window.location.href);
    });

    test('returns correct rl', () => {
      expect(content.rl).toBe('');
    });

    test('returns correct de', () => {
      expect(content.de).toBe(document.characterSet);
    });

    test('returns correct sr', () => {
      expect(content.sr).toBe(`${window.screen.width}x${window.screen.height}`);
    });

    test('returns correct vp', () => {
      expect(content.vp).toBe(`${window.innerWidth}x${window.innerHeight}`);
    });

    test('returns correct cd', () => {
      expect(content.cd).toBe(window.screen.colorDepth);
    });

    test('returns correct dt', () => {
      expect(content.dt).toBe(document.title);
    });

    test('returns correct bn', () => {
      expect(content.bn).toBe(browser.nameAndVersion());
    });

    test('returns correct md', () => {
      expect(content.md).toBe(browser.isMobile());
    });

    test('returns correct ua', () => {
      expect(content.ua).toBe(browser.userAgent());
    });

    test('returns correct tz', () => {
      expect(content.tz).toBe(new Date().getTimezoneOffset());
    });

    test('returns correct utm', () => {
      expect(content.utm).toBe('');
      expect(cookie.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('marshalData', () => {
    test('returns empty string if data is not defined', () => {
      expect(marshalData()).toBe('');
    });

    test('returns JSON object if data is an object', () => {
      const testObject = { test: 'test' };
      expect(marshalData(testObject)).toBe(JSON.stringify(testObject));
    });

    test('returns executed data function', () => {
      const func = jest.fn();
      expect(marshalData(func)).toBe(func());
      expect(func).toHaveBeenCalledTimes(3);
    });

    test('returns data coerced to string', () => {
      expect(marshalData(12)).toBe('12');
      expect(marshalData('test')).toBe('test');
      expect(marshalData(true)).toBe('true');
      expect(marshalData(false)).toBe('false');
    });
  });

  describe('getTargetUrl', () => {
    beforeEach(() => {
      init('xxx-account', backend);
    });

    test('returns all queries concatenated', () => {
      expect(getTargetUrl({
        testing: 'is',
        better: 'than',
        having: 'sex',
      })).toBe(`${settings.options.targetUrl}?testing=is&better=than&having=sex&`);
    });
  });

  describe('sendBeacon', () => {
    test('sends a beacon with the generated url', () => {
      window.navigator.sendBeacon = jest.fn();
      sendBeacon(attributes);
      expect(window.navigator.sendBeacon).toHaveBeenCalledTimes(1);
      expect(window.navigator.sendBeacon).toHaveBeenCalledWith(getTargetUrl(attributes));
    });
  });

  describe('sendImage', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const getElementSpy = jest.spyOn(document, 'getElementsByTagName');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    sendImage(attributes);

    test('generates an image', () => {
      expect(createElementSpy).toHaveBeenCalledTimes(1);
      expect(createElementSpy).toHaveBeenCalledWith('img');
    });

    test('the image is inserted into the body', () => {
      expect(getElementSpy).toHaveBeenCalledTimes(1);
      expect(getElementSpy).toHaveBeenCalledWith('body');
      expect(appendChildSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fire', () => {
    beforeEach(() => {
      settings.initted = true;
    });

    test('When settings.initted is false no do anything', () => {
      settings.initted = false;
      fire(eventType);
    });

    test('Check when we are not passing data', () => {
      fire(eventType);
    });

    describe('when sendBeacon it will be called', () => {
      test('When navigator have sendBeacon and default use useBeacon the sendBeacon function is called', () => {
        window.navigator.sendBeacon = jest.fn();
        settings.options.sendBeacon = true;
        fire(eventType, data);
        expect(window.navigator.sendBeacon).toHaveBeenCalledTimes(1);
      });
    });

    describe('when sendImage it will be called', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');

      afterEach(() => {
        fire(eventType, data);
        expect(createElementSpy).toHaveBeenCalledTimes(1);
        expect(createElementSpy).toHaveBeenCalledWith('img');
        createElementSpy.mockClear();
      });

      test('When navigator have sendBeacon and default use useBeacon as false the sendImage function is called', () => {
        window.navigator.sendBeacon = jest.fn();
        settings.options.sendBeacon = false;
      });

      test('When navigator does NOT have sendBeacon and default use useBeacon the sendImage function is called', () => {
        window.navigator.sendBeacon = undefined;
        settings.options.sendBeacon = true;
      });

      test('When navigator does NOT have sendBeacon and default use as false useBeacon the sendImage function is called', () => {
        window.navigator.sendBeacon = undefined;
        settings.options.sendBeacon = false;
      });
    });
  });

  describe('init', () => {
    const accountId = 'account-123456';
    const initialAccountID = settings.accountId;

    describe('When is a new visitor', () => {
      beforeEach(() => {
        settings.initted = false;
        cookie.setUtms = jest.fn();
        cookie.get = generateCookieMOCK(true);
        init(accountId, backend);
      });

      afterEach(() => {
        settings.accountId = initialAccountID;
      });

      test('the argument passed sets on settings.accountId', () => {
        expect(settings.accountId).toEqual(accountId);
      });

      test('ensureAndGetSessionID is called', () => {
        expect(cookie.get).toHaveBeenCalledTimes(2);
        expect(cookie.get).toHaveBeenCalledWith('sid');
      });

      test('ensureAndGetVisitorID is called', () => {
        expect(cookie.get).toHaveBeenCalledTimes(2);
        expect(cookie.get).toHaveBeenCalledWith('uid');
      });

      test('expect that cookie.setUtms to have been called', () => {
        expect(cookie.setUtms).toHaveBeenCalledTimes(1);
      });
    });

    describe('When is a NOT new visitor', () => {
      beforeEach(() => {
        settings.initted = false;
        jest.clearAllMocks();
      });

      test('When settings.initted is true, no do nothing', () => {
        settings.initted = true;
        init(accountId, backend);
        expect(cookie.get).toHaveBeenCalledTimes(0);
      });

      test('When is initted but no have accountId defined, no do nothing', () => {
        init(null, backend);
        expect(cookie.get).toHaveBeenCalledTimes(0);
      });

      test('When is initted and have accountId but not have config defined, no do nothing', () => {
        init(accountId, null);
        expect(cookie.get).toHaveBeenCalledTimes(0);
      });

      test('When is initted and have accountId but config miss targetUrl value, no do nothing', () => {
        init(accountId, {});
        expect(cookie.get).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('init with options', () => {
    const accountId = 'account-123456';
    const options = {
      ...backend,
      cookiePrefix: '_ir',
      useBeacon: false,
    };
    beforeEach(() => {
      settings.initted = false;
      init(accountId, options);
    });
    test('Expect targetUrl to be the one from options', () => {
      expect(settings.options.targetUrl).toEqual(options.targetUrl);
    });
    test('Expect cookiePrefix to be the one from options', () => {
      expect(settings.options.cookiePrefix).toEqual(options.cookiePrefix);
    });

    test('Expect useBeacon to be the one from options', () => {
      expect(settings.options.useBeacon).toEqual(options.useBeacon);
    });
  });

  describe('init will not overrrite account id', () => {
    const accountId = 'account-123456';
    const accountId2 = 'account-000000';
    beforeEach(() => {
      init(accountId, backend);
      init(accountId2, backend);
    });
    test('Expect account id not to be ovewritten', () => {
      expect(settings.accountId).toEqual(accountId);
    });
  });

  describe('Iris', () => {
    test('Expect is and object with fire and init methods', () => {
      expect(Iris).toEqual({
        init,
        fire,
      });
    });
  });
});
