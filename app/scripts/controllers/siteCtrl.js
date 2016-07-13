'use strict';
/**
 * @ngdoc controller
 * @name yaMaps.controller:SiteCtrl
 * @module yaMaps
 * @kind controller
 * @requires $interpolate
 * @requires $translate
 * @requires $document
 * @requires $location
 * @requires $route
 * @requires yaMaps.service:authService
 * @requires yaMaps.objects:version
 *
 * @description
 * Controller for global site settings used in `index.html`. Removes the `no-js`
 * class from the `<html>` tag to confirm Angular has started up correctly.
 *
 * The site controller exposes the following objects
 *
 * * `appVersion` - `{object}` - application-wide {@link yaMaps.objects:version build info}
 * * `customer` - `{object}` - customer object from {@link yaMaps.objects:globals global configuration}
 * * `features` - `{object}` - feature object from {@link yaMaps.objects:globals global configuration}
 *
 * @example
 * ```html
    <html lang="{{site.getLang()}}" class="no-js" ng-app="yaMaps"
      ng-controller="SiteCtrl as site" ng-class="site.getSiteClasses()">
    <head>
        <base href="/">
        <script type="text/javascript" src="scripts/yaMaps.min.js"></script>
    </head>
    <body>
    </body>
    </html>
  ```
 */

angular.module('yaMaps')
.controller('SiteCtrl', ['$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;
  var siteClasses = [];

  // 2 requirements
  var $document        = $injector.get('$document');
  var $location        = $injector.get('$location');
  var $route           = $injector.get('$route');
  var globals          = $injector.get('globals');
  var version          = $injector.get('version');
  var $log             = $injector.get('$log');
  var log              = globals.debug ? angular.bind(null, $log.debug, 'C[Site]') : angular.noop;

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope
  // $scope.$on('$routeChangeStart', checkRoutes);
  $scope.$on('$routeChangeSuccess', updateSiteClasses);
  $scope.$on('$routeChangeError', handleRouteError);

  // 4 Expose methods and properties on the controller instance
  this.getSiteClasses = getSiteClasses;
  this.go = go;
  controller.getCurrentPageTitle = getCurrentPageTitle;

  // pull site configuration into top scope
  this.appVersion = version;
  this.customer = globals.customer;
  this.features = globals.features;
  this.debug = globals.debug;
  // this.notImplemented = notImplemented;
  this.closeNav = closeNav;
  // controller.startEmailDiag = startEmailDiag;

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  // startup
  init();

  // 6. All the actual implementation goes here

  /**
    * @ngdoc method
    * @name yaMaps.controller:SiteCtrl#getSiteClasses
    * @methodOf yaMaps.controller:SiteCtrl
    * @kind function
    *
    * @description
    * Returns an array of CSS classes to be set on the document's body.
    *
    * @returns {Array}  Array of CSS class names to be placed on the `<body>` tag.
    */
  function getSiteClasses () {
    return siteClasses;
  }

  function init () {
    log('init()');
    // remove noscript class from document's html tag on angular start
    $document.find('html').eq(0).removeClass('no-js');
  }

  function updateSiteClasses () {

    siteClasses.length = 0;

    // set <body> class tag to a value defined in route object
    if ($route.current && $route.current.bodyClass) {
      siteClasses.push($route.current.bodyClass);
    }
  }

  // on $routeChangeError retirect to / and clear URL query params
  function handleRouteError () {
    $location.url('/');
  }

  function go (url) {
    $location.url( url || '/dashboard' );
  }

  function closeNav () {
    var e = angular.element(document).find('.navbar-toggle');
    e.click();
  }

  function getCurrentPageTitle () {
    var val = '';
    if ($route.current) {
      val = $route.current.title;
    }
    return val;
  }
}]);

