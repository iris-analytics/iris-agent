!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).Iris={})}(this,(function(e){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var n={accountId:null,initted:!1,options:{cookiePrefix:"_iris_",targetUrl:"/",useBeacon:!0}},o=function(e){return null!=e&&""!==e},i=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))},r=function(e,t){var n=t;t||(n=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var o=new RegExp("[?&]".concat(e,"(=([^&#]*)|&|#|$)"),"i").exec(n);return o?o[2]?decodeURIComponent(o[2].replace(/\+/g," ")):"":null},c={set:function(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1440,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"/",r=new Date;r.setTime(r.getTime()+60*o*1e3);var c="; expires=".concat(r.toGMTString()),a="https:"===window.location.protocol?"; SameSite=None; Secure":"; SameSite=Lax";document.cookie="".concat(n.options.cookiePrefix+e,"=").concat(t).concat(c,"; path=").concat(i).concat(a)},get:function(e){for(var t="".concat(n.options.cookiePrefix+e,"="),o=document.cookie.split(";"),i=0;i<o.length;i+=1){for(var r=o[i];" "===r.charAt(0);)r=r.substring(1);if(0===r.indexOf(t))return r.substring(t.length,r.length)}return""},setUtms:function(){for(var e=["utm_source","utm_medium","utm_term","utm_content","utm_campaign"],t=!1,n=0,i=e.length;n<i;n+=1)if(o(r(e[n]))){t=!0;break}if(t){for(var a,u={},s=0,d=e.length;s<d;s+=1)a=r(e[s]),o(a)&&(u[e[s]]=a);c.set("utm",JSON.stringify(u))}}},a=function(){var e,t=navigator.userAgent,n=t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];return/trident/i.test(n[1])?(e=/\brv[ :]+(\d+)/g.exec(t)||[],"IE ".concat(e[1]||"")):"Chrome"===n[1]&&null!==(e=t.match(/\b(OPR|Edge)\/(\d+)/))?e.slice(1).join(" ").replace("OPR","Opera"):(n=n[2]?[n[1],n[2]]:[navigator.appName,navigator.appVersion,"-?"],null!==(e=t.match(/version\/(\d+)/i))&&n.splice(1,1,e[1]),n.join(" "))},u=function(){return"ontouchstart"in document},s=function(){return window.navigator.userAgent},d=function(){var e=c.get("uid");return o(e)||(e=i()),c.set("uid",e,1051200),e},f=function(){var e=c.get("sid");return o(e)||(e=i()),c.set("sid",e,30),e},l=function(e,t){return{id:n.accountId,uid:d(),sid:f(),ev:e,ed:t,dl:window.location.href,rl:document.referrer,ts:1*new Date,de:document.characterSet,sr:"".concat(window.screen.width,"x").concat(window.screen.height),vp:"".concat(window.innerWidth,"x").concat(window.innerHeight),cd:window.screen.colorDepth,dt:document.title,bn:a(),md:u(),ua:s(),tz:(new Date).getTimezoneOffset(),utm:c.get("utm")||""}},m=function(e){return o(e)?"object"===t(e)?JSON.stringify(e):"function"==typeof e?e(e()):String(e):""},g=function(e){var t="?";return Object.keys(e).forEach((function(n){t+="".concat(n,"=").concat(encodeURIComponent(e[n]),"&")})),n.options.targetUrl+t},x=function(e){window.navigator.sendBeacon(g(e))},p=function(e){var t=document.createElement("img");t.src=g(e),t.style.display="none",t.width="1",t.height="1",document.getElementsByTagName("body")[0].appendChild(t)},h=function(e,t){if(!0===n.initted){var o=l(e,m(t));window.navigator.sendBeacon&&n.options.useBeacon?x(o):p(o)}},v=function(e,t){!0!==n.initted&&o(e)&&o(t)&&o(t.targetUrl)&&(n.accountId=e,n.options.targetUrl=t.targetUrl,o(t.cookiePrefix)&&(n.options.cookiePrefix=t.cookiePrefix),o(t.useBeacon)&&(n.options.useBeacon=t.useBeacon),f(),d(),c.setUtms(),n.initted=!0)},w={init:v,fire:h};e.default=w,e.ensureAndGetSessionID=f,e.ensureAndGetVisitorID=d,e.fire=h,e.getContent=l,e.getTargetUrl=g,e.init=v,e.marshalData=m,e.sendBeacon=x,e.sendImage=p,Object.defineProperty(e,"__esModule",{value:!0})}));
