import settings from './settings';
import cookie from './cookie';
import browser from './browser';
import { isset, generateId } from './utils';

export const ensureAndGetVisitorID = () => {
  let uid = cookie.get('uid');
  if (!isset(uid)) {
    uid = generateId();
  }
  cookie.set('uid', uid, 1051200);
  return uid;
};

export const ensureAndGetSessionID = () => {
  let sid = cookie.get('sid');
  if (!isset(sid)) {
    sid = generateId();
  }
  cookie.set('sid', sid, 30);
  return sid;
};

export const getContent = (eventType, data) => ({
  id: settings.accountId, // website Id
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

export const marshalData = (data) => {
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

export const getTargetUrl = (content) => {
  let queryString = '?';
  Object.keys(content).forEach((prop) => {
    queryString += `${prop}=${encodeURIComponent(content[prop])}&`;
  });
  return settings.options.targetUrl + queryString;
};

export const sendBeacon = (attributes) => {
  window.navigator.sendBeacon(getTargetUrl(attributes));
};

export const sendImage = (attributes) => {
  const img = document.createElement('img');
  img.src = getTargetUrl(attributes);
  img.style.display = 'none';
  img.width = '1';
  img.height = '1';
  document.getElementsByTagName('body')[0].appendChild(img);
};

/**
 * Fire an event
 * @param {string} eventType name of the event
 * @param {misc} data data attached to the event being fired
 */
export const fire = (eventType, data) => {
  if (settings.initted !== true) {
    // console.log('Iris not initted. Init first and/or check init arguments.');
    return;
  }

  const attributes = getContent(eventType, marshalData(data));
  if (window.navigator.sendBeacon && settings.options.useBeacon) {
    sendBeacon(attributes);
  } else {
    sendImage(attributes);
  }
};

/**
 * Method that must be invoked first to set iris
 * @param {string} accountId
 * @param {object} config
 */
export const init = (accountId, config) => {
  // If initted, don't do anything
  if (settings.initted === true) {
    // console.log('Iris already initted. Nothing to do')
    return;
  }

  // accountID must be set
  if (!isset(accountId)) {
    // console.log('Iris: "accountId" must be set')
    return;
  }

  // targetUrl must be set and must point to iris-backend ingestion path
  if (!isset(config) || !isset(config.targetUrl)) {
    // console.log('Iris: "config.targetUrl" must be set')
    return;
  }
  settings.accountId = accountId;
  settings.options.targetUrl = config.targetUrl;

  if (isset(config.cookiePrefix)) {
    settings.options.cookiePrefix = config.cookiePrefix;
  }

  if (isset(config.useBeacon)) {
    settings.options.useBeacon = config.useBeacon;
  }
  ensureAndGetSessionID();
  ensureAndGetVisitorID();
  cookie.setUtms();
  settings.initted = true;
};

const Iris = {
  init,
  fire,
};

export default Iris;
