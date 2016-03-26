/* global layer */
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  /**
   * Hardcoded user identities
   */
  var USERS = [
    'Customer Support',
    'Customer'//,
//    'Bob',
//    'Robot'
  ];

  /**
   * layerSample global utility
   *
   * @param {String}    appId - Layer Staging Application ID
   * @param {Array}     users - Hard-coded users Array
   * @param {String}    user - Logged in user
   * @param {Function}  challenge - Layer Client challenge function
   */
  window.layerSample = {
    appId: null,
    users: USERS,
    user: USERS[0],
    challenge: function(nonce, callback) {
      layer.xhr({
        url: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
        headers: {
          'X_LAYER_APP_ID': window.layerSample.appId,
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'POST',
        data: {
          nonce: nonce,
          app_id: window.layerSample.appId,
          user_id: window.layerSample.user
        }
      }, function(res) {
        if (res.success) {
          console.log('challenge: ok');

          callback(res.data.identity_token);

          // Cleanup identity dialog
          var node = document.getElementById('identity');
          node.parentNode.removeChild(node);
        } else {
          console.error('challenge error: ', res.data);
        }
      });
    },
    dateFormat: function(date) {
      var now = new Date();
      if (!date) return now.toLocaleDateString();

      if (date.toLocaleDateString() === now.toLocaleDateString()) return date.toLocaleTimeString();
      else return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

  var button = document.querySelectorAll('#identity button')[0];

  button.addEventListener('click', function() {
    var appId = 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8';

    button.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';

    window.layerSample.appId = appId;
    try {
       localStorage.layerAppId = appId;
    } catch(e) {}
    // window.layerSample.user = '';

    window.postMessage('layer:identity', '*');
  });
});
