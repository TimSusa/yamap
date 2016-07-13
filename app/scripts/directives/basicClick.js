'use strict';
/**
 * @ngdoc directive
 * @name yaMaps.directives:clusterStatesView
 * @module yaMaps
 * @kind controller
 *
 * @description
 *
 */
angular.module('yaMaps')
.directive('basicClick', function($parse) {
  return {
    compile: function(elem, attr) {
      var fn = $parse(attr.basicClick);
      return function(scope, elem) {
        elem.on('click', function(e) {
          fn(scope, { $event: e });
          scope.$apply();
        });
      };
    }
  };
});
