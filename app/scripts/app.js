'use strict';
// VARIANT: yaMaps
/**
  * @ngdoc overview
  * @name yaMaps
  * @module yaMaps
  * @description
  *
  * # yaMaps (core application module)
  * The yaMaps module is loaded when the application is started. The module itself
  * contains all essential components for the application to function. The
  * navigation bar on the left contains a list of the services/factories, filters,
  * directives, controllers and testing components available within this core module.
  *
  * To use the YaMaps application your HTML page must contain the `ng-app="yaMaps"`
  * tag and also set `<base href="/">` to enable the HTML5 mode history API. Please note
  * that name and location of the minified script may differ from the example and depends
  *  on your build system and web server configuration.
  *
  * @example
  * ```html
    <html ng-app="yaMaps">
    <head>
        <base href="/">
        <script type="text/javascript" src="scripts/yaMaps.min.js"></script>
    </head>
    <body>
    </body>
    </html>
  ```
  *
  *
  * # Browser Compatibility
  *
  * YaMaps is compatible with all modern web browsers and does not support deprecated
  * browsers such as IE 8 and below. Here is a list of browsers on which the application
  * is verified to run:
  *
  * - Firefox 35 and above (tested on FF 35.0.1)
  * - Chrome 40 and above (tested on FF 40.0.2214.111)
  * - Safari 6 and above (tested on Safari 6.1.6 (7537.78.2))
  */
angular.module( 'yaMaps.resources', []);
var app = angular.module( 'yaMaps', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngMessages',
//  'yaMaps.resources',
  'yaMaps.templates.html',
  'duScroll',
  'ui.bootstrap'
]);

/**
  * @ngdoc function
  * @name ng.$q:chain
  * @module ng
  * @description
  * Extends angular's $q service with a "chain" method that runs multiple functions
  * in sequential order waiting for each function to return a result before calling
  * the next. In contrast to the `promis.then()` style pattern return parameters are
  * not passed between functions.
  *
  * To be compatible, functions must return a promise. `$q.chain()` expects function
  * or arrays of function parameters.
  *
  * @param {(Function|Array)} fn One or multiple functions or arrays of functions to call in sequence.
  *                              If an array is provided `chain()` executes functions in the array before
  *                              following parameters. Arrays may be constructed recursively.
  *                              `chain(fn, fn)` and `chain([fn, fn])` are equivalent.
  *
  * @returns {Promise} A newly generated promise containing the last arguments return value or
  *                    any intermediate rejection condition if a chained function failed.
  *
  * @example
  * ```js
    function runSequence() {
      return $q.chain(
        function a () { $scope.processing = true; },
        function b () { return $http.get('/api/user'); },
        function c () { $scope.processing = false; }
      );
    }
  ```
  *
  */
app.config(['$provide', function ($provide) {

  // extend $q with a chain function
  $provide.decorator('$q', function($delegate){
    $delegate.chain = function() {
      var x;
      for(var i = 0; i < arguments.length; i++) {
        if (!x) {
          // jscs: disable
          x = arguments[i] instanceof Array ? $delegate.chain.apply(this || window, arguments[i]) : $delegate.when(arguments[i]());
        } else {
          x = arguments[i] instanceof Array ? x.then($delegate.chain.apply(this || window, arguments[i])) : x.then(arguments[i]);
          // jscs: enable
        }
      }
      return x;
    };
    return $delegate;
  });

  // replace $log service with our own version
  $provide.decorator('$log', ['$delegate', 'logService', function ($delegate, logService) {

    // $delegate is the original $log service which we forward calls to
    logService.setDelegate($delegate);

    // return our service instance
    return logService;
  }]);

}])

// enable html5 mode
.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}])

// Conifg Maps
.config(['MapConfigProvider', function(MapConfigProvider) {
  MapConfigProvider.setOptions ( {
    appId: 'b1EnEFoJUlM7DxbOUluz',
    appCode: '9l73AMb88mO7U-udRkrIUQ',
    libraries: 'ui,mapevents,pano',
    pixelRatio: 2, // Optional (Default: 1)
    pixelPerInch: 320, // Optional (Default: 72)
    useHTTPS: true
  });
}])

// configure routes
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.

    when('/main-page', {
      bodyClass: 'main-page',
      templateUrl: 'views/main-page.html',
      controller: 'MainPageCtrl',
      controllerAs: 'mpc',
      title: ' '
    }).
    // home page
    when('/', {
      bodyClass: 'main-page',
      templateUrl: 'views/main-page.html',
      controller: 'MainPageCtrl',
      controllerAs: 'mpc',
      title: ' '
    }).
    when('/examples', { redirectTo: '/examples/marker' }).
    when('/examples/:page', {
      templateUrl: 'views/examples.html',
      controller: 'ExamplesViewCtrl',
      controllerAs: 'evc',
      title: ' '
    }).
    when('/contact', {
      templateUrl: 'views/contact.html',
      title: ' '
    }).
    when('/imprint', {
      // templateUrl: 'views/imprint.html'
      templateUrl: 'views/main-page.html'
    }).
    when('/faq', {
      templateUrl: 'views/main-page.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

