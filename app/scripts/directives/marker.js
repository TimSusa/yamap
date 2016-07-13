'use strict';
/**
 * @ngdoc directive
 * @name yaMaps.directives:MarkerIcon
 * @module yaMaps
 * @kind controller
 * @requires $document
 * @requires $location
 * @requires $route
 * @requires yaMaps.objects:version
 *
 * @description
 * Controller for top-level navigation.
 *
 * Exposes the {@link yaMaps.controller:UserNavCtrl UserNavCtrl} controller as `nav` to the scope
 * which exports the
 * following objects
 *
 * * `langs` - `{Array<string>}` - supported translation language keys
 * * `user` - `{object}` - User object when logged in
 *
 */

angular.module('yaMaps')
  .directive('marker', function () {
    return {
      require: '^map',
      scope: {
        coordinates: '=',
        icon: '=',
        zIndex: '='
      },
      restrict: 'E',
      link: function(scope, element, attrs, mapController) {
        var icon = scope.icon || '';
        var coordinates;
        var group;

        scope.addMarker = function() {
          if (scope.coordinates) {
            coordinates = scope.coordinates;
            group = mapController.addMarkerToMap(scope.coordinates, scope.zIndex, icon);
          }
        };

        scope.$watch('coordinates', function() {
          if (coordinates) {
            mapController.removeMarker(group);
          }
          scope.addMarker();
        });
      }
    };
  });
