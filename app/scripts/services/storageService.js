'use strict';
/**
  * @ngdoc service
  * @name yaMaps.service:storageService
  * @module yaMaps
  * @kind service
  * @requires $window
  * @requires yaMaps.objects:globals
  *
  * @description
  * Central service for wrapping the browser's window.localStorage object. Stores
  * values under keys in local storage which is restricted by browser implementations
  * to be read from the origin domain only.
  *
  * Keys are prefixed with a value defined in {@link api/yaMaps.objects:globals global configuration}
  * under key `localStorageKey`.
  */
angular.module('yaMaps')

.factory('storageService', [ '$injector', function ($injector) {

  var $window         = $injector.get('$window');
  var globals         = $injector.get('globals');
  var hasLocalStorage = detectLocalStorage();
  var isDefined       = angular.isDefined;
  var storage;

  function detectLocalStorage () {
    try {
      var t = '_yaMaps_localStorage';
      storage = $window.localStorage || localStorage;
      storage.setItem(t, t);
      storage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  }

  function expandKey (key) {
    return [globals.localStorageKey, key].join('.');
  }

  return {
    /**
      * @ngdoc method
      * @name yaMaps.service:storageService#put
      * @methodOf yaMaps.service:storageService
      * @kind function
      *
      * @description
      * Stores value under a given key in local storage. Key is prefixed by `localStorageKey`.
      *
      * @param {string} key   Key to store value under.
      * @param {string} value Value to store.
      *
      */
    put : function (key, value) {
      if (hasLocalStorage && isDefined(value)) {
        storage.setItem(expandKey(key), angular.toJson(value));
      }
    },

    /**
      * @ngdoc method
      * @name yaMaps.service:storageService#get
      * @methodOf yaMaps.service:storageService
      * @kind function
      *
      * @description
      * Retrieves value stored under a given key from local storage. Key is prefixed by `localStorageKey`.
      *
      * @param {string} key           Key to retrieve.
      * @param {value}  defaultValue  Default value returned if key does not exist.
      *
      */
    get : function (key, defaultVal) {
      var v = hasLocalStorage ? storage.getItem(expandKey(key)) : defaultVal;
      if (isDefined(v) && v !== null) {
        // special handling for booleans
        if (v === 'false') {
          return false;
        } else if (v === 'true') {
          return true;
        } else {
          return angular.fromJson(v);
        }
      }

      return defaultVal;
    },

    /**
      * @ngdoc method
      * @name yaMaps.service:storageService#remove
      * @methodOf yaMaps.service:storageService
      * @kind function
      *
      * @description
      * Removes a key/value pair stored in local storage. Does not fail if key
      * does not exist. Key is prefixed by `localStorageKey`.
      *
      * @param {string} key  Key to remove.
      */
    remove : function (key) {
      try {
        storage.removeItem(expandKey(key));
      } catch (e) {}
    },

    /**
      * @ngdoc method
      * @name yaMaps.service:storageService#clear
      * @methodOf yaMaps.service:storageService
      * @kind function
      *
      * @description
      * Removes all key/value pair stored in local storage. Note that this only applies
      * to keys from the current application domain (i.e. Host part of the URL the application
      * was initially loaded from). Does not fail.
      *
      * Note: Keys are NOT prefixed by `localStorageKey`, so any value is deleted!
      *
      */
    clear : function() {
      try {
        storage.clear();
      } catch (e) {}
    }
  };
}]);
