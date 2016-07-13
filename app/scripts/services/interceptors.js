'use strict';

angular.module('yaMaps')

/**
  * @ngdoc property
  * @name ng.$httpProvider:timeoutInterceptor
  * @requires $timeout
  * @requires $log
  * @requires $q
  * @requires yaMaps.objects:globals
  *
  * @description $http interceptor that registeres a dynamic timeout for each API call.
  *
  * @example
  * ```js
    angular.module( 'yaMaps', []).config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('timeoutInterceptor');
    }]);
  * ```
  */
.factory('timeoutInterceptor', ['$injector', function ($injector) {

  var globals   = $injector.get('globals');
  var $timeout  = $injector.get('$timeout');
  var $log      = $injector.get('$log');
  var $q        = $injector.get('$q');

  return {
    request: function (config) {
      // set request timeout
      if (globals.apiTimeout) {
        config.timeout = $timeout(function () {
          $log.error('API TIMEOUT', config.url);
        }, globals.apiTimeout);
      }
      return config || $q.when(config);
    },
    response: function (response) {
      // cancel timeout
      $timeout.cancel(response.config.timeout);
      return response || $q.when(response);
    },
    responseError: function(response) {
      // cancel timeout
      $timeout.cancel(response.config.timeout);
      return $q.reject(response);
    }
  };
}])

/**
  * @ngdoc property
  * @name ng.$httpProvider:logInterceptor
  * @requires $timeout
  * @requires $log
  * @requires $q
  * @requires yaMaps.objects:globals
  *
  * @description $http interceptor logs success or failure of each API call.
  *
  * @example
  * ```js
    angular.module( 'yaMaps', []).config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('logInterceptor');
    }]);
  * ```
  */
.factory('logInterceptor', ['$injector', function ($injector) {

  var logService   = $injector.get('logService');
  var $q           = $injector.get('$q');

  return {
    response: function (response) {
      logService.callSuccess(response);
      return response || $q.when(response);
    },
    responseError: function (rejection) {
      logService.callFailed(rejection);
      return $q.reject(rejection);
    }
  };
}]);
