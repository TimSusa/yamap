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
  .directive('templateMarker', function () {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        scope.id = attrs.id;
      },
      templateUrl: function(tElement, tAttrs) {
        tElement.addClass('marker');
        return tAttrs.templateurl;
      }
    };
  });
