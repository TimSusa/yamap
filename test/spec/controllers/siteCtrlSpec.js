'use strict';

describe('SiteCtrl', function() {

  beforeEach(module('yaMaps'));
  beforeEach(module('yaMaps.resources'));
  beforeEach(module('yaMaps.templates.html'));

  var ctrl;
  var scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('SiteCtrl', { $scope: scope });
  }));

  // it('should toogle the provider', function() {
  //   expect(3).toBe(3);
  // });
});
