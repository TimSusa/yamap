'use strict';
/**
 * @ngdoc directive
 * @name yaMaps.directives:UserNav
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
.directive('userNav', function () {

  // In order to toggling the side menu, this function works as event listener
  // and DOM-Element decorator.
  function link ( scope, element, attr ) {

    // Parse attribute: Strip out chars and whitespaces, create int array
    var valArr = attr.userNav.replace(/\s|px/g, "").split(',');

    // Compare as integer value
    var smallWidth = parseInt(valArr[0], 10) < parseInt(valArr[1], 10) ? valArr[0] : valArr[1];
    var tallWidth  = parseInt(valArr[0], 10) > parseInt(valArr[1], 10) ? valArr[0] : valArr[1];

    // Attach click listener at top menu li item
    var clickListen = element.children('ul').children('li').eq(0);
    clickListen.on('click', function() {

      // Toggle css property and class
      var elem = element.children();
      if (scope.nav.isToggled) {
        element.css('width', tallWidth + 'px');
        elem.addClass('open');
      } else {
        element.css('width', smallWidth + 'px');
        elem.removeClass('open');
      }
      scope.nav.isToggled = !scope.nav.isToggled;
      scope.$apply();
    });
  }
  return {
    restrict: 'A',
    replace: true,
    scope: {
      userNav: '@userNav'
    },
    controller: 'UserNavCtrl',
    controllerAs: 'nav',
    templateUrl: 'directives/userNav.html',
    link: link
  };
})

/**
 * @ngdoc controller
 * @name yaMaps.controller:UserNavCtrl
 * @module yaMaps
 * @kind controller
 * @requires yaMaps.service:clusterService
 * @requires yaMaps.service:authService
 * @requires yaMaps.objects:globals
 *
 * @description
 * Controller for top-level navigation.
 *
 */
.controller('UserNavCtrl', [ '$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  var $location        = $injector.get('$location');
  var globals          = $injector.get('globals');

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // $scope.$watch(clusterService.getCluster, init);
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope

  // 4 Expose methods and properties on the controller instance
  // this.logout = userController.logout.bind(userController);
  this.is = is;
  this.switchCaret = switchCaret;
  this.menuNav = globals.menuNav;
  this.isToggled = true;

  // pull site configuration into top scope
  // this.langs = globals.features.languages;
  var menuIcons = [
    '/assets/images/menu/menu-bars-2.svg',
    '/assets/images/menu/menu-close.svg'
  ];

  this.minCaret = [];
  this.menuIcon = menuIcons[0];
  this.getIcon = getIcon;

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  // 6. All the actual implementation goes here

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserNavCtrl#is
    * @methodOf yaMaps.controller:UserNavCtrl
    * @kind function
    *
    * @description
    * Check the current URL path obtained from `$location` matches a segment.
    * This is useful to set CSS active class on navigation elements.
    *
    * @param {String} segment String to compare against a url segment.
    * @param {Number} pos     Position in the URL path to compare, default: 1, When 0
    *                         matches `segment` against the entire URL path.
    *
    * @returns {boolean}  True if the current route contains the string.
    */
  function is (segment, pos) {
    var url = $location.path();
    if (!pos) {
      return url === segment;
    }
    var ret = url.split('/')[pos || 1] === segment;
    // Note: splitting /user/dashboard results in ['','user','dashboard']
    return ret;
  }

  function getIcon ( ) {
    if ( controller.isToggled ) {
      controller.menuIcon = menuIcons[0];
    } else {
      controller.menuIcon = menuIcons[1];
    }
    return controller.menuIcon;
  }

  function switchCaret ( idx ) {
    for(var i = 0; i <= controller.menuNav.main.length;i++){
      if (idx !== i) {
        controller.minCaret[i] = false;
      }

    }
    controller.minCaret[idx] = !controller.minCaret[idx];
  }
}]);

