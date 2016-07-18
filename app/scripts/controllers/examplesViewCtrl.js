'use strict';
/**
 * @ngdoc controller
 * @name lambdanow.controller:ExamplesViewCtrl
 * @module lambdanow
 * @kind controller
 * @requires lambdanow.service:authService
 *
 * @description
 * Main Controller for user account settings.
 *
 */

angular.module('yaMaps')
.controller('ExamplesViewCtrl', ['$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  var $routeParams     = $injector.get('$routeParams');
  var globals          = $injector.get('globals');
  var $window          = $injector.get('$window');

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope

  // 4 Expose methods and properties on the controller instance
  this.page = $routeParams.page;
  this.is = is;
  this.enabled = enabled;
  this.href = href;
  this.pages = ['marker', 'itinerary'];

  // first map
  controller.map =
  { zoom : 15,
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

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  function is (page) {
    return controller.page === page;
  }

  function enabled (page) {
    switch (page) {
    case 'billing':
      return globals.features.payment;
    case 'credentials':
      return globals.features.credentials;
    default:
      return true;
    }
  }

  function href (page) {
    return '/examples/' + page;
  }

}]);
