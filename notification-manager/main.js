'use strict';

function postSubscriptionId(subscriptionId, currentUser) {
  var requestBody = null, xmlhttp = new XMLHttpRequest();
  var layerId = currentUser.layerId;
  var subscriptionsAPI = 'https://curaytor-m-api.herokuapp.com/layer_users/'+
    layerId + '/gcm_subscriptions';
  xmlhttp.open("POST", subscriptionsAPI);
  requestBody = {
    identifier: subscriptionId
  };
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send( JSON.stringify(requestBody) );
}

function setupNotificationServiceWorker(currentUser) {
  if ('serviceWorker' in navigator) {
    getUsersStore().then((usersStore)=> {
      usersStore.store.put(currentUser);
      usersStore.closeCallback();
      console.log('Service Worker is supported');
      navigator.serviceWorker.register('sw.js');
      navigator.serviceWorker.ready.then(function(reg) {
        reg.pushManager.subscribe({
          userVisibleOnly: true
        }).then(function(sub) {
          var elements = sub.endpoint.split('/');
          postSubscriptionId(elements[elements.length - 1], currentUser);
        });
      }).catch(function(err) {
        console.log(err);
      });
    });
    /*
     */
  }
}
