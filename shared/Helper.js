var URLSearchParams = require('url-search-params');
var URL = require('dom-urls');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function urlWithParams(urlString, paramsParam) {
  var params = paramsParam || {};
  var url = new URL(urlString);
  var searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
  url.search = searchParams.toString();
  return url.toString();
}

module.exports = {
  urlWithParams: urlWithParams,
  getRandomInt: getRandomInt
};
