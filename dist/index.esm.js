function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var settings = {
  accountId: null,
  initted: false,
  options: {
    cookiePrefix: '_iris_',
    targetUrl: '/',
    useBeacon: true
  }
};

/* eslint-disable no-bitwise */
var isset = function isset(variable) {
  return typeof variable !== 'undefined' && variable !== null && variable !== '';
};
var generateId = function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

/**
 * All about Cookies
 */

var Url = {
  // http://stackoverflow.com/a/901144/1231563
  getParameterByName: function getParameterByName(name, url) {
    var currentUrl = url;
    if (!url) currentUrl = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line

    var regex = new RegExp("[?&]".concat(name, "(=([^&#]*)|&|#|$)"), 'i');
    var results = regex.exec(currentUrl);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },
  externalHost: function externalHost(link) {
    return link.hostname !== window.location.hostname && link.protocol.indexOf('http') === 0;
  }
};
var cookie = {
  set: function set(name, value) {
    var minutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1440;
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
    var date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    var expires = "; expires=".concat(date.toGMTString());
    document.cookie = "".concat(settings.options.cookiePrefix + name, "=").concat(value).concat(expires, "; path=").concat(path, "; SameSite=Lax;");
  },
  get: function get(name) {
    var prefixedName = "".concat(settings.options.cookiePrefix + name, "=");
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i += 1) {
      var c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(prefixedName) === 0) return c.substring(prefixedName.length, c.length);
    }

    return '';
  },
  setUtms: function setUtms() {
    var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
    var exists = false;

    for (var i = 0, l = utmArray.length; i < l; i += 1) {
      if (isset(Url.getParameterByName(utmArray[i]))) {
        exists = true;
        break;
      }
    }

    if (exists) {
      var val;
      var save = {};

      for (var idx = 0, len = utmArray.length; idx < len; idx += 1) {
        val = Url.getParameterByName(utmArray[idx]);

        if (isset(val)) {
          save[utmArray[idx]] = val;
        }
      }

      cookie.set('utm', JSON.stringify(save));
    }
  }
};

/**
 * All about Browser
 */
var browser = {
  nameAndVersion: function nameAndVersion() {
    // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
    var ua = navigator.userAgent;
    var tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return "IE ".concat(tem[1] || '');
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);

      if (tem !== null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem !== null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  },
  isMobile: function isMobile() {
    return 'ontouchstart' in document;
  },
  userAgent: function userAgent() {
    return window.navigator.userAgent;
  }
};

var ensureAndGetVisitorID = function ensureAndGetVisitorID() {
  var uid = cookie.get('uid');

  if (!isset(uid)) {
    uid = generateId();
  }

  cookie.set('uid', uid, 1051200);
  return uid;
};
var ensureAndGetSessionID = function ensureAndGetSessionID() {
  var sid = cookie.get('sid');

  if (!isset(sid)) {
    sid = generateId();
  }

  cookie.set('sid', sid, 30);
  return sid;
};
var getContent = function getContent(eventType, data) {
  return {
    id: settings.accountId,
    // website Id
    uid: ensureAndGetVisitorID(),
    // user Id
    sid: ensureAndGetSessionID(),
    // Session id
    ev: eventType,
    // event being triggered
    ed: data,
    // any event data to pass along
    dl: window.location.href,
    // document location
    rl: document.referrer,
    // referrer location
    ts: 1 * new Date(),
    // timestamp when event was triggered
    de: document.characterSet,
    // document encoding
    sr: "".concat(window.screen.width, "x").concat(window.screen.height),
    // screen resolution
    vp: "".concat(window.innerWidth, "x").concat(window.innerHeight),
    // viewport size
    cd: window.screen.colorDepth,
    // color depth
    dt: document.title,
    // document title
    bn: browser.nameAndVersion(),
    // browser name and version number
    md: browser.isMobile(),
    // is a mobile device?
    ua: browser.userAgent(),
    // user agent
    tz: new Date().getTimezoneOffset(),
    // timezone difference to UTC in minutes
    utm: cookie.get('utm') || '' // get the utms

  };
};
var marshalData = function marshalData(data) {
  if (!isset(data)) {
    return '';
  }

  if (_typeof(data) === 'object') {
    // runs optionalData again to reduce to string in case something else was returned
    return JSON.stringify(data);
  }

  if (typeof data === 'function') {
    // runs the function and calls optionalData again to reduce further if it isn't a string
    return data(data());
  }

  return String(data);
};
var getTargetUrl = function getTargetUrl(content) {
  var queryString = '?';
  Object.keys(content).forEach(function (prop) {
    queryString += "".concat(prop, "=").concat(encodeURIComponent(content[prop]), "&");
  });
  return settings.options.targetUrl + queryString;
};
var sendBeacon = function sendBeacon(attributes) {
  window.navigator.sendBeacon(getTargetUrl(attributes));
};
var sendImage = function sendImage(attributes) {
  var img = document.createElement('img');
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

var fire = function fire(eventType, data) {
  if (settings.initted !== true) {
    // console.log('Iris not initted. Init first and/or check init arguments.');
    return;
  }

  var attributes = getContent(eventType, marshalData(data));

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

var init = function init(accountId, config) {
  // If initted, don't do anything
  if (settings.initted === true) {
    // console.log('Iris already initted. Nothing to do')
    return;
  } // accountID must be set


  if (!isset(accountId)) {
    // console.log('Iris: "accountId" must be set')
    return;
  } // targetUrl must be set and must point to iris-backend ingestion path


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
var Iris = {
  init: init,
  fire: fire
};

export default Iris;
export { ensureAndGetSessionID, ensureAndGetVisitorID, fire, getContent, getTargetUrl, init, marshalData, sendBeacon, sendImage };
