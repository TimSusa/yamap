'use strict';
/* global element: true */
/* global by: true */
var YaMapsPage = function( loginObj ) {

  this.adminName = loginObj.adminName;
  this.adminPass = loginObj.adminPass;
  this.testUserName = loginObj.testUserName;
  this.testUserPass = loginObj.testUserPass;
  this.testUserEmail = loginObj.testUserEmail;
};

YaMapsPage.prototype = Object.create({}, {
  adminName: {
    writable: true,
    configurable:true,
    value: 'name-not-set-yet'
  },
  adminPass: {
    writable: true,
    configurable:true,
    value: 'pass-not-set-yet'
  },
  testUserName: {
    writable: true,
    configurable:true,
    value: 'name-not-set-yet'
  },
  testUserPass: {
    writable: true,
    configurable:true,
    value: 'pass-not-set-yet'
  },
  testUserEmail: {
    writable: true,
    configurable:true,
    value: 'email-not-set-yet'
  },
  go: {
    value: function( to ) {
      return browser.get('#!/' + to);
      // return browser.setLocation(to);
    }
  },
  // Input fields
  inputChannelName: {
    get: function(){
      return element(by.model('sc.data.topic'));
    }
  },
  inputNrOfPartitions: {
    get: function(){
      return element(by.model('sc.data.partitions'));
    }
  },
  inputSchemaName: {
    get: function(){
      return element(by.model('sc.data.name'));
    }
  },
  inputDescription: {
    get: function(){
      return element(by.model('sc.data.doc'));
    }
  },
  createNewFieldButton: {
    value: function( buttonNumber ) {
      var button = 'btn-' + buttonNumber;
      return element(by.name(button));
    }
  },
  inputField: {
    value: function( fieldNumber ) {
      var field = 'field-' + fieldNumber;
      return element(by.name(field));
    }
  },
  inputFieldType: {
    value: function( typeNumber, chosenOne ){
      var type = 'type-' + typeNumber;
      return element(by.name(type)).element(by.cssContainingText('option', chosenOne)).click();
    }
  },
  addUserInputEmail: {
    get: function(){
      return element(by.xpath('//*[@id="ngdialog1"]/div[2]/div[2]/form/div[1]/div/div/input'));
      // return element(by.model('uc.data.email'));
    }
  },
  addUserInputName: {
    get: function(){
      return element(by.model('uc.data.name'));
    }
  },
  addUserInputPass: {
    get: function(){
      return element(by.xpath('//*[@id="ngdialog1"]/div[2]/div[2]/form/div[3]/div[1]/div/input'));
    }
  },
  addCredInputSshKeyName: {
    get: function(){
      return element(by.model('dcc.data.name'));
    }
  },
  addCredInputSshKey: {
    get: function(){
      return element(by.model('dcc.data.key'));
    }
  },
  loginName: {
    get: function(){
      return element(by.model('lc.data.name'));
    }
  },
  loginPass: {
    get: function(){
      return element(by.model('lc.data.password'));
    }
  },
  login: {
    value: function() {
      this.loginName.sendKeys(this.testUserName);
      this.loginPass.sendKeys(this.testUserPass);
      this.loginButton.click();
    }
  },
  loginAsAdmin: {
    value: function() {
      this.loginName.sendKeys(this.adminName);
      this.loginPass.sendKeys(this.adminPass);
      this.loginButton.click();
    }
  },
  // adminDropDown: {
  //   get: function(){
  //     return element(by.css('.fa-user'));
  //   }
  // },
  // adminDropDownLogout: {
  //   get: function(){
  //     return element(by.css('.fa-unlock-alt'));
  //   }
  // },
  getLogoutButton: {
    get: function(){
      return element(by.css('[basic-click="unc.logout()"]'));
    }
  },
  logout: {
    value: function(){
      element(by.css('[basic-click="unc.logout()"]')).click();
    }
  },
  // Buttons
  loginButton: {
    get: function(){
      return element(by.css('.submit'));
    }
  },
  addUserButton: {
    get: function(){
      return element(by.css('[basic-click="ac.addUser()"]'));
    }
  },
  addCredentialsSshButton: {
    get: function(){
      return element(by.css('[basic-click="cc.startAddCredDiag(cc.providers.ssh)"]'));
    }
  },
  addCredentialsSshButtonFinish: {
    get: function(){
      return element(by.css('[basic-click="dcc.create(callState)"]'));
    }
  },
  // genPassButton: {
  //   get: function(){
  //     return element(by.xpath('/html/body/div[2]/div[2]/div[2]/form/div[3]/div[2]/button'));
  //   }
  // },
  userFormAddButton: {
    get: function(){
      return element(by.css('[basic-click="uc.create(callState)"]'));
    }
  },
  enableDebugModeButton: {
    get: function(){
      return element(by.name('debug-start'));
    }
  },
  startClusterButton: {
    get: function(){
      return element(by.css('[basic-click="cc.startCluster(callState)"]'));
    }
  },
  checkClusterButton: {
    get: function(){
      return element(by.css('[basic-click="cc.checkCluster()"]'));
    }
  },
  updateClusterButton: {
    get: function(){
      return element(by.css('[basic-click="cc.updateCluster(callState)"]'));
    }
  },
  stopClusterButton: {
    get: function(){
      return element(by.css('[basic-click="cc.stopCluster(callState)"]'));
    }
  },
  stopClusterDiagOkButton: {
    get: function(){
      return element(by.css('[basic-click="confirm()"]'));
    }
  },
  newSchemaButton: {
    get: function(){
      return element(by.css('[basic-click="sc.newSchema();"]'));
    }
  },
  newSchemaSubmitButton: {
    get: function(){
      return element(by.css('[basic-click="sc.saveSchema(callState);"]'));
    }
  },
  choseSshKeyCombobox: {
    get: function () {
      return element(by.xpath('/html/body/div/div/div/div/div[2]/div/div/div/form/div[3]/fieldset/div[2]/div/div/div'));
    }
  },
  choseSshKeyComboboxEntry: {
    get: function () {
      return element(by.binding('key.name'));
    }
  },
  choseSshKeyComboboxEntryUpdate: {
    get: function () {
      return element(by.css('[ng-init="cc.registerCallState(callState)"]'));
    }
  },
  chooseSshKeyComboboxText: {
    get: function () {
      return element(by.binding('cc.getSSHKey().name')).getText();
    }
  },
  sortTableByCreatedAtButton: {
    get: function(){
      return element(by.css('[translate="admin.users.createdAt"]'));
    }
  },
  // Misc elements
  clusterStateIdle: {
    get: function(){
      return element(by.css('.nav-status.idle'));
    }
  },
  clusterStateStarting: {
    get: function(){
      return element(by.css('.nav-status.starting'));
    }
  },
  clusterStateRunning: {
    get: function(){
      return element(by.css('.nav-status.running'));
    }
  },
  clusterStateStopping: {
    get: function(){
      return element(by.css('.nav-status.stopping'));
    }
  },
  hueLoaded: {
    get: function(){
      return element(by.id('hueframe'));
    }
  },
  credentials: {
    get: function(){
      return element.all(by.binding('i.name')).getText();
    }
  },
  schemaTableLoaded: {
    get: function(){
      return element(by.id('schematable'));
    }
  },
  allSchemaNames: {
    get: function(){
      return element(by.binding('s.schema.name'));
    }
  },
  allSchemaNamesText: {
    get: function(){
      return element.all(by.binding('s.schema.name')).getText();
    }
  },
  getDataApiElem: {
    get: function(){
      return element(by.xpath('//*[@id="page-content-wrapper"]/div/div/div/div/div/div[2]/div/div/div[3]/div[2]/div[1]/div/div/div/div[2]/div[1]/div/span'));
    }
  },
  getDataApiElemText: {
    get: function(){
      return this.getDataApiElem.getText();
    }
  },
  getDataApiToken: {
    get: function(){
      return element(by.id('data-api-token'));
    }
  },
  getDataApiUrl: {
    get: function(){
      return element(by.id('data-api-url'));
    }
  },
  getClusterInstances: {
    value: function(binding){
      return element.all(by.binding(binding)).getText();
    }
  },  // Helper
  getTextByTranslateId: {
    value: function(id){
      var tmpStr = '[translate="' + id + '"]';
      // Remember: getText() returns a promise!
      return element(by.css(tmpStr)).getText();
    }
  },
  hasClass: {
    value: function (element, cls) {
      return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
      });
    }
  },
  log: {
    value: function( msg ) {
      return console.log( msg );
    }
  },
  logCond: {
    value: function( cond, msg ) {
      var newMsg = '';
      if (cond) {
        newMsg = msg + ': OK';
      } else {
        newMsg = msg + ': ERROR';
      }
      return console.log(newMsg);
    }
  },
  lg: {
    value: function( cond, msg ) {
      var logCond = this.logCond;
      return browser.controlFlow().execute(function(){
        logCond(cond, msg);
      });
    }
  },
  waitUntilReady: {
    value: function (elm) {
      browser.wait(function () {
        return elm.isPresent();
      }, 2400000);
      browser.wait(function () {
        return elm.isDisplayed();
      }, 2400000);
    }
  }
  // Could be used as check, if form is dirty after input click
  // expect(hasClass(element(by.name('getoffer')), 'ngDirty')).toBe(true);

  // Get element with tag < button > and has ng-show attribute
  // element(by.Css("button[ng-show]"));

  // Get element with tag < button > and has ng-show attribute which contains word flag
  // element(by.Css("button[ng-show*=flag]"));

  // element(by.buttonText("Submit"));

  // element(by.css('[basic-click="myFunction()"]'))

  // element(by.xpath('(//*[@class="k-link"])[2]'))

  // element(by.linkText('Contact me')).click();
});

module.exports = YaMapsPage;
