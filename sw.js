// Version 0.14

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
    return getNotificationsStore().then(function(notificationsStore) {
      for (var i = 0; i < notifications.length; ++i) {
        notification = notifications[i];
        notificationsStore.store.put(notification);
        promise = ctx.registration.showNotification(notification.title, {
          body: notification.content,
          icon: notification.image_url,
          tag: notification.id
        });
        promises.push(promise)
      }
      notificationsStore.closeCallback();
      return Promise.all(promises);
    });
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

function openNotificationWindow(notificationId) {
  var promises = [], clientList, notification, getNotification, targetURL;
  promises.push(
    clients.matchAll({
      type: "window"
    })
  );
  promises.push(getNotificationsStore().then(function(notificationsStore){
    getNotification = notificationsStore.store.get(parseInt(notificationId));
    return new Promise(function(resolve, reject) {
      getNotification.onsuccess = function() {
        if (getNotification.result) {
          resolve(getNotification.result);
        } else {
          reject();
        }
        notificationsStore.closeCallback();
      };
    });
  }));
  return Promise.all(promises).then(function (values) {
    clientList = values[0];
    notification = values[1];
    targetURL = notification.url;
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url.indexOf(targetURL) > -1 && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow) {
      return clients.openWindow(targetURL);
    }
  });
}

// Event Handlers

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
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn't close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(openNotificationWindow(event.notification.tag));
});