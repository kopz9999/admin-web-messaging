import * as Constants from './constants';

export default class Helper {
  static hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  static generatePastelColors(str) {
    var redScope = (Math.round((Helper.hashCode(str[0]) / 100) * 1) * 127);
    var r = (redScope + 110).toString(16);
    var greenScope = Math.round((Helper.hashCode(str[1]) / 100) *127);
    var g = (greenScope + 110).toString(16);
    var blueScope = Math.round(((Helper.hashCode(str.substring(0, 2)) / 10000) * 2) *127);
    var b = (blueScope + 127).toString(16);
    return '#' + r + g + b;
  };

  static formatTimestamp(date) {
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

  static timeSinceCompose(date) {
    return `${Helper.timeSince(date)} ago`;
  }

  static initialsFromFullName(fullName) {
    var names = fullName.split(' ');
    var displayInitials;
    if (names.length > 1) {
      displayInitials = (names[0][0] + names[1][0]).toUpperCase();
    } else {
      displayInitials = fullName.substr(0, 2).toUpperCase();
    }
    return displayInitials;
  };

  static timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + "s";
  }

  /* String Manipulation */
  static trimUserName(originalString) {
    return Helper.cutString(originalString, Constants.MAX_USER_SIZE, ' ... ');
  }

  static cutString(originalString, maxSize, suffix) {
    let finalString = originalString;
    if (finalString && finalString.length > maxSize) {
      finalString = finalString.substring(0, maxSize) + suffix;
    }
    return finalString;
  }
}