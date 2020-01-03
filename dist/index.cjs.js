'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const defaults = {
  accountId: null,
  cookiePrefix: '_iris_',
  targetUrl: 'https://www.example.com/iris.gif',
  useBeacon: true,
};

/* eslint-disable no-bitwise */
const isset = (variable) => (
  typeof variable !== 'undefined' && variable !== null && variable !== ''
);

const generateId = () => (
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })
);

/**
 * All about Cookies
 */

const Url = {
  // http://stackoverflow.com/a/901144/1231563
  getParameterByName(name, url) {
    let currentUrl = url;
    if (!url) currentUrl = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'i');
    const results = regex.exec(currentUrl);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  externalHost(link) {
    return (
      link.hostname !== window.location.hostname && link.protocol.indexOf('http') === 0
    );
  },
};

const cookie = {
  set(name, value, minutes = 1440, path = '/') {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    const expires = `; expires=${date.toGMTString()}`;
    document.cookie = `${defaults.cookiePrefix + name}=${value}${expires}; path=${path}`;
  },

  get(name) {
    const prefixedName = `${defaults.cookiePrefix + name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(prefixedName) === 0) return c.substring(prefixedName.length, c.length);
    }
    return '';
  },

  setUtms() {
    const utmArray = [
      'utm_source',
      'utm_medium',
      'utm_term',
      'utm_content',
      'utm_campaign',
    ];
    let exists = false;
    for (let i = 0, l = utmArray.length; i < l; i += 1) {
      if (isset(Url.getParameterByName(utmArray[i]))) {
        exists = true;
        break;
      }
    }
    if (exists) {
      let val;
      const save = {};
      for (let idx = 0, len = utmArray.length; idx < len; idx += 1) {
        val = Url.getParameterByName(utmArray[idx]);
        if (isset(val)) {
          save[utmArray[idx]] = val;
        }
      }
      cookie.set('utm', JSON.stringify(save));
    }
  },
};

/**
 * All about Browser
 */
const browser = {
  nameAndVersion() {
    // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
    ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return `IE ${tem[1] || ''}`;
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem !== null) {
        return tem
          .slice(1)
          .join(' ')
          .replace('OPR', 'Opera');
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem !== null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  },

  isMobile() {
    return 'ontouchstart' in document;
  },

  userAgent() {
    return window.navigator.userAgent;
  },
};

const ensureAndGetVisitorID = () => {
  let uid = cookie.get('uid');
  if (!isset(uid)) {
    uid = generateId();
  }
  cookie.set('uid', uid, 1051200);
  return uid;
};

const ensureAndGetSessionID = () => {
  let sid = cookie.get('sid');
  if (!isset(sid)) {
    sid = generateId();
  }
  cookie.set('sid', sid, 30);
  return sid;
};

const getContent = (eventType, data) => ({
  id: defaults.accountId, // website Id
  uid: ensureAndGetVisitorID(), // user Id
  sid: ensureAndGetSessionID(), // Session id
  ev: eventType, // event being triggered
  ed: data, // any event data to pass along
  dl: window.location.href, // document location
  rl: document.referrer, // referrer location
  ts: 1 * new Date(), // timestamp when event was triggered
  de: document.characterSet, // document encoding
  sr: `${window.screen.width}x${window.screen.height}`, // screen resolution
  vp: `${window.innerWidth}x${window.innerHeight}`, // viewport size
  cd: window.screen.colorDepth, // color depth
  dt: document.title, // document title
  bn: browser.nameAndVersion(), // browser name and version number
  md: browser.isMobile(), // is a mobile device?
  ua: browser.userAgent(), // user agent
  tz: new Date().getTimezoneOffset(), // timezone difference to UTC in minutes
  utm: cookie.get('utm') || '', // get the utms
});

const marshalData = (data) => {
  if (!isset(data)) {
    return '';
  } if (typeof data === 'object') {
    // runs optionalData again to reduce to string in case something else was returned
    return JSON.stringify(data);
  } if (typeof data === 'function') {
    // runs the function and calls optionalData again to reduce further if it isn't a string
    return data(data());
  }
  return String(data);
};

const getTargetUrl = (content) => {
  let queryString = '?';
  Object.keys(content).forEach((prop) => {
    queryString += `${prop}=${encodeURIComponent(content[prop])}&`;
  });
  return defaults.targetUrl + queryString;
};

const sendBeacon = (attributes) => {
  window.navigator.sendBeacon(getTargetUrl(attributes));
};

const sendImage = (attributes) => {
  const img = document.createElement('img');
  img.src = getTargetUrl(attributes);
  img.style.display = 'none';
  img.width = '1';
  img.height = '1';
  document.getElementsByTagName('body')[0].appendChild(img);
};

const fire = (eventType, data) => {
  const attributes = getContent(eventType, marshalData(data));
  if (window.navigator.sendBeacon && defaults.useBeacon) {
    sendBeacon(attributes);
  } else {
    sendImage(attributes);
  }
};

const init = (accountId, config = {}) => {
  if (defaults.accountId === null) {
    defaults.accountId = accountId;
  }
  if (isset(config)) {
    if (isset(config.targetUrl)) {
      defaults.targetUrl = config.targetUrl;
    }
    if (isset(config.cookiePrefix)) {
      defaults.cookiePrefix = config.cookiePrefix;
    }
    if (isset(config.useBeacon)) {
      defaults.useBeacon = config.useBeacon;
    }
  }
  ensureAndGetSessionID();
  ensureAndGetVisitorID();
  cookie.setUtms();
};

const Iris = {
  init,
  fire,
};

exports.default = Iris;
exports.ensureAndGetSessionID = ensureAndGetSessionID;
exports.ensureAndGetVisitorID = ensureAndGetVisitorID;
exports.fire = fire;
exports.getContent = getContent;
exports.getTargetUrl = getTargetUrl;
exports.init = init;
exports.marshalData = marshalData;
exports.sendBeacon = sendBeacon;
exports.sendImage = sendImage;
