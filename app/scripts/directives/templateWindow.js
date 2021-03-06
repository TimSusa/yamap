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
  .directive('templateWindow', function () {
    return {
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateurl;
      }
    };
  });
