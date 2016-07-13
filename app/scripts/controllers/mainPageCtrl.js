'use strict';
/**
 * @ngdoc controller
 * @name yaMaps.controller:MainPageCtrl
 * @module yaMaps
 * @kind controller
 * @requires $log
 * @requires yaMaps.resources.service:User
 * @requires yaMaps.resources.service:Auth
 * @requires yaMaps.service:authService
 * @requires yaMaps.objects:globals
 *
 * @description
 * Controller for managing user-related actions like login, email, password and user lifecycle.
 *
 */
angular.module('yaMaps')
.controller('MainPageCtrl', [ '$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  // var $location        = $injector.get('$location');
  var globals          = $injector.get('globals');
  var $window = $injector.get('$window');
  var $log = $injector.get('$log');
  var log = globals.debug ? angular.bind(null, $log.debug, 'C[MainPageCtrl]') : angular.noop;

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope

  // 4 Expose methods and properties on the controller instance
  this.data = {}; // name, password

  this.user = null;

  // first map
  controller.map =
  { zoom : 14,
    center : {
      lat: 52.5159,
      lng: 13.3777
    }};
  controller.marker = {
    coordinates : {
      lat: 52.5159,
      lng: 13.3777
    },
    icon: {
      events: {
        tap: function(data) {
          $window.alert('icon params = latitude: ' + data.lat + ', longitude: ' + data.lng);
        }
      }
    }
  };
  controller.map2 = {
    zoom : 14,
    center : {
      lng: -0.135559,
      lat: 51.513872
    }
  };
  controller.marker2 = {
    coordinates : {
      lng: -0.14,
      lat: 51.513872
    },
    icon: {
      events: {
        tap: function(data) {
          $window.alert('icon params = latitude: ' + data.lat + ', longitude: ' + data.lng);
        }
      }
    }
  };

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  init();

  // 6. All the actual implementation goes here
  function init () {

    log('init()');

  }

}]);
