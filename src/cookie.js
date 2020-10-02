import settings from './settings';
import { isset } from './utils';
/**
 * All about Cookies
 */

export const Url = {
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
    const sameSite = window.location.protocol === 'https:' ? '; SameSite=None; Secure' : '; SameSite=Lax';
    document.cookie = `${settings.options.cookiePrefix + name}=${value}${expires}; path=${path}${sameSite}`;
  },

  get(name) {
    const prefixedName = `${settings.options.cookiePrefix + name}=`;
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

export default cookie;
