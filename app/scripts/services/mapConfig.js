'use strict';
/**
 * @ngdoc service
 * @name yaMaps.service:MapConfig
 * @module yaMaps
 * @kind provider
 *
 * @description
 * Controller for top-level navigation.
 *
 *
 */

angular.module('yaMaps')
  .provider('MapConfig', function () {

    this.mapOptions = {};

    this.$get = function() {
      var mapOptions = this.mapOptions;

      return {
        appId: function(appId) {
          return mapOptions.appId || appId;
        },
        appCode: function(appCode) {
          return mapOptions.appCode || appCode;
        },
        pixelRatio: function(ratio) {
          return mapOptions.pixelRatio || ratio;
        },
        pixelPerInch: function(pixel) {
          return mapOptions.pixelPerInch || pixel;
        },
        libraries: function(libraries) {
          return mapOptions.libraries || libraries;
        },
        useHTTPS: function(https) {
          return mapOptions.useHTTPS || https;
        }
      };
    };

    this.setOptions = function(options) {
      this.mapOptions = options;
    };
  });
