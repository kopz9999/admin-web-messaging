// Version 0.1

'use strict';
var currentUser = null;

function displayNotifications(layerId) {
  // var xhr = new XMLHttpRequest();
  var notificationsAPI = 'https://curaytor-m-api.herokuapp.com/layer_users/'+
    layerId + '/notifications';
  var promises = [], notifications, notification, promise;
  var ctx = self;

  return fetch(notificationsAPI).then(function(response) {
    return response.json();
  }).then(function(notifications) {
    for (var i = 0; i < notifications.length; ++i) {
      notification = notifications[i];
      promise = ctx.registration.showNotification(notification.title, {
        body: notification.content,
        icon: notification.image_url,
        tag: notification.id
      });
      promises.push(promise)
    }
    return Promise.all(promises);
  });
};

// TODO
console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('message', function(event) {
  currentUser = event.data;
});
self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  event.waitUntil(displayNotifications(currentUser.layerId) );
});
