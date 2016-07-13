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
  .directive('markers', function () {
    return {
      restrict: 'E',
      require: '^map',
      scope: {
        locations: '=',
        icon: '=',
        zIndex: '='
      },
      link: function(scope, element, attrs, mapController) {
        _.each(scope.locations, function(location) {
          mapController.addMarkerToMap(location.coordinates, scope.zIndex, scope.icon, location.icon, location.id);
        });
      }
    };
  });
