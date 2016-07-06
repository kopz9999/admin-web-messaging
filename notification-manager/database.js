// Constants
var DB_VERSION = 2;
// Variables
var dbName = "CuraytorMessaging";
var usersStoreName = 'UsersStore';
var notificationsStoreName = 'NotificationsStore';
var globalOpen = indexedDB.open(dbName, DB_VERSION);
// Create the schema
globalOpen.onupgradeneeded = function() {
  var db = globalOpen.result;
  console.log('Upgrading DB...');
  [usersStoreName, notificationsStoreName].forEach(function (storeName) {
    try {
      db.deleteObjectStore(storeName);
    }
    catch (e) {  }
    db.createObjectStore(storeName, { keyPath: "id" });
  });
  console.log('DB Upgraded!');
};

function useDatabase() {
  var open = indexedDB.open(dbName, DB_VERSION);
  return new Promise(function(resolve) {
    open.onsuccess = function() {
      resolve(open);
    }
  });
}

function getStoreByName(storeName) {
  return useDatabase().then(function(open){
    var db = open.result;
    var tx = db.transaction(storeName, "readwrite");
    var closeCallback = function() {
      tx.oncomplete = function() {
        db.close();
      };
    };
    return {
      store: tx.objectStore(storeName),
      closeCallback: closeCallback
    };
  });
}

function getUsersStore() {
  return getStoreByName(usersStoreName);
}

function getNotificationsStore() {
  return getStoreByName(notificationsStoreName);
}
