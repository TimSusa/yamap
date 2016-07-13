'use strict';

describe('UserCtrl', function() {

  beforeEach(module('yaMaps'));
  beforeEach(module('yaMaps.resources'));
  beforeEach(module('yaMaps.templates.html'));

  // dependencies to inject into the controller
  var deps = {
    $routeParams: { inviteCode: 'abcde' }
  };
  var ctrl;
  var scope;
  var location;

  beforeEach(inject(function($controller, $rootScope, $location, $injector) {

    // mock injector
    var injector = {
      get: function (name) {
        if (deps.hasOwnProperty(name)) {
          return deps[name];
        } else {
          return $injector.get(name);
        }
      }
    };

    scope = $rootScope.$new();
    ctrl = $controller('UserCtrl', { $scope: scope, $injector: injector });
    location = $location;
  }));

  // it('should have no value for user, pass, email', function() {
  //   expect(ctrl.data.name).toBe(undefined);
  //   expect(ctrl.data.password).toBe(undefined);
  //   expect(ctrl.data.email).toBe(undefined);
  // });

  // applies to SignupCtrl now!
  // it('should get invite code from url param', function() {
  //   expect(ctrl.data.invite).toBe(deps.$routeParams.inviteCode);
  // });

});
