var userStoreName = 'UsersStore';
var dbName = "CuraytorMessaging";
var globalOpen = indexedDB.open(dbName, 1);
// Create the schema
globalOpen.onupgradeneeded = function() {
  var db = globalOpen.result;
  db.createObjectStore(userStoreName, { keyPath: "id" });
};

function useDatabase() {
  var open = indexedDB.open(dbName, 1);
  return new Promise(function(resolve) {
    open.onsuccess = function() {
      resolve(open);
    }
  });
}

function getUsersStore() {
  return useDatabase().then(function(open){
    var db = open.result;
    var tx = db.transaction(userStoreName, "readwrite");
    var closeCallback = function() {
      tx.oncomplete = function() {
        db.close();
      };
    };
    return {
      store: tx.objectStore(userStoreName),
      closeCallback: closeCallback
    };
  });
}
