'use strict';

var baseUrl = browser.baseUrl;
var YaMapsPage = require('../../test/e2e/yaMaps.page.js');

describe('Routing test admin role', function () {
  var params = browser.params;
  var page;
  beforeEach(function () {
    var userObj = {
      adminName: params.login.adminName,
      adminPass: params.login.adminPass
    };
    page = new YaMapsPage(userObj);
  });

  it('should navigate to technology', function () {
    var to = 'technology';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  // it('should navigate to benefits', function () {
  //   var to = 'benefits';
  //   page.go(to);
  //   expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  // });

  it('should navigate to pricing', function () {
    var to = 'pricing';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to help', function () {
    var to = 'help';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to tutorial/manage-ssh-keys', function () {
    var to = 'tutorial/manage-ssh-keys';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to tutorial/file-data-processing', function () {
    var to = 'tutorial/file-data-processing';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to tutorial/event-data-processing', function () {
    var to = 'tutorial/event-data-processing';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to faq', function () {
    var to = 'faq';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to glossary', function () {
    var to = 'glossary';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  // it('should navigate to aboutus', function () {
  //   var to = 'aboutus';
  //   page.go(to);
  //   expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  // });

  it('should navigate to imprint', function () {
    var to = 'imprint';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to tos', function () {
    var to = 'tos';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to welcome', function () {
    var to = 'welcome';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to register', function () {
    var to = 'register';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to login', function () {
    var to = 'login';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  //
  // Log in
  //
  it('should navigate to cluster/status after logging in', function () {
    // var to = 'login';
    // page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + 'login');
    page.loginAsAdmin();
    expect(browser.getCurrentUrl()).toEqual(baseUrl + 'cluster/status');
  });

  it('should navigate to cluster/status', function () {
    var to = 'cluster';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to + '/status');
  });

  it('should navigate to cluster/resources', function () {
    var to = 'cluster/resources';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to cluster/kafka', function () {
    var to = 'cluster/kafka';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to cluster/hadoop', function () {
    var to = 'cluster/hadoop';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to cluster/samza', function () {
    var to = 'cluster/samza';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to cluster/history', function () {
    var to = 'cluster/history';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to settings/profile', function () {
    var to = 'settings';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to + '/profile');
  });

  it('should navigate to settings/credentials', function () {
    var to = 'settings/credentials';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to manage/users', function () {
    var to = 'manage';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to + '/users');
  });

  it('should navigate to manage/registrations', function () {
    var to = 'manage/registrations';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to manage/clusters', function () {
    var to = 'manage/clusters';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  it('should navigate to manage/limits', function () {
    var to = 'manage/limits';
    page.go(to);
    expect(browser.getCurrentUrl()).toEqual(baseUrl + to);
  });

  //
  // Log out
  //
  it('should navigate to home after logging out', function () {
    page.adminDropDown.click();
    expect(page.adminDropDownLogout.isDisplayed()).toBe(true);
    page.adminDropDownLogout.click().then(function () {
      expect(page.adminDropDownLogout.isDisplayed()).toBe(false);
    });
  });
});
