// Version 0.13

'use strict';
importScripts('./notification-manager/database.js');

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

function retrieveCurrentUser() {
  var getUsers;
  return getUsersStore().then(function(usersStore) {
    getUsers = usersStore.store.getAll();
    return new Promise(function(resolve, reject){
      getUsers.onsuccess = function() {
        if (getUsers.result.length > 0) {
          resolve(getUsers.result[0]);
        } else {
          reject();
        }
      };
    });
  });
}

// TODO
console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  event.waitUntil(retrieveCurrentUser().then(
    function(currentUser) {
      return displayNotifications(currentUser.layerId)
    }
  ));
});
