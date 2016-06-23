// Libs
var fetch = require('isomorphic-fetch');
var USER_INFO_ENDPOINT = require('../../shared/Endpoints').USER_INFO_ENDPOINT;
var urlWithParams = require('../../shared/Helper').urlWithParams;
var userFactoryInstance = require('../models/User').userFactoryInstance;

function getUserByToken(authToken) {
  return fetch(urlWithParams(USER_INFO_ENDPOINT, { token: authToken }))
    .then(response => response.json())
    .then(json => userFactoryInstance.buildFromBaseAPI(json));
}

module.exports = {
  getUserByToken: getUserByToken
};
