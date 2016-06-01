import * as Constants from './constants';

export function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function generatePastelColors(str) {
  var redScope = (Math.round((hashCode(str[0]) / 100) * 1) * 127);
  var r = (redScope + 110).toString(16);
  var greenScope = Math.round((hashCode(str[1]) / 100) *127);
  var g = (greenScope + 110).toString(16);
  var blueScope = Math.round(((hashCode(str.substring(0, 2)) / 10000) * 2) *127);
  var b = (blueScope + 127).toString(16);
  return '#' + r + g + b;
}

export function formatTimestamp(date) {
  var now = new Date();
  if (!date) return now.toLocaleDateString();
  if (date.toLocaleDateString() === now.toLocaleDateString()) {
    return date.toLocaleTimeString(navigator.language,{
      hour12: false,
      hour: '2-digit',
      minute:'2-digit'
    });
  }
  else return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export function timeSinceCompose(date) {
  return timeSince(date, 'ago');
}

export function initialsFromFullName(fullName) {
  var names = fullName.split(' ');
  var displayInitials;
  if (names.length > 1) {
    displayInitials = (names[0][0] + names[1][0]).toUpperCase();
  } else {
    displayInitials = fullName.substr(0, 2).toUpperCase();
  }
  return displayInitials;
}

export function timeSince(date, suffix) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + ` years ${suffix}`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ` months ${suffix}`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + `d ${suffix}`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + `h ${suffix}`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + `m ${suffix}`;
  }
  if (seconds < 0) return 'Just now';
  else return Math.floor(seconds) + `s ${suffix}`;
}

/* String Manipulation */
export function trimUserName(originalString) {
  return cutString(originalString, Constants.MAX_USER_SIZE, ' ... ');
}

export function cutString(originalString, maxSize, suffix) {
  let finalString = originalString;
  if (finalString && finalString.length > maxSize) {
    finalString = finalString.substring(0, maxSize) + suffix;
  }
  return finalString;
}

export function urlWithParams(urlString, params={}) {
  var url = new URL(urlString);
  var searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
  url.search = searchParams.toString();
  return url.toString();
}

export function toUUID(layerIdentifier) {
  return layerIdentifier.replace(/^layer:\/\/\/.+\//, '');
}

export function getLayerConversationId(conversationId) {
  return `layer:///conversations/${conversationId}`;
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return "";
}
