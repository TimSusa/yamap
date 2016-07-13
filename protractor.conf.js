'use strict';
/* global browser: true */
/* global jasmine: true */
//
// Protractor Configuration File
//
// e2e tests can be found in 'test/e2e/*.spec.js'

exports.config = {
  framework: 'jasmine2',

  // The location of the selenium standalone server .jar file.
  // seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',

  // The port to start the selenium server on, or null if the server should
  // find its own unused port.
  seleniumPort: null,

  // Chromedriver location is used to help the selenium standalone server
  // find chromedriver. This will be passed to the selenium jar as
  // the system property webdriver.chrome.driver. If null, selenium will
  // attempt to find chromedriver using PATH.
  chromeDriver: 'node_modules/protractor/selenium/chromedriver',

  // The address of a running selenium server. If this is specified,
  // seleniumServerJar and seleniumPort will be ignored.
  // seleniumAddress: 'http://localhost:4444/wd/hub/',

  // The URL where the server we are testing is running
  baseUrl: 'http://localhost:9001',

  // Spec patterns are relative to the loacation of the
  // spec file. They may include glob patterns
  specs: [
    'test/e2e/routing.spec.js'
  ],

  // Capabilities to be passed to the Webdriver instance
  multiCapabilities: [{
    'browserName': 'chrome',
    chromeOptions: {
      args: ['lang=en'],
    },
  }],

  params: {
      login: {
        adminName: 'teststaging',
        adminPass: 'lURilJ-XXr',
        testUserPass: 'snIH7I9Yi8'
      },
      credentials: {
        teststagingSsh: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDV4VZur2ocEW0mQVdC1zeQIv8ImaXvBW5SLkWcNK6iMIMJLlN9/YtGJXqGlM1j/dEzdDa+XFC0b2ltaQ3tnKM6GD1klVV1E6AtgQcJzaw6JXAYzTkCiwQFo6M5u+y0D2C12iBWOrPy2quFK7fKPzWGDc4pzNQx+zkR78ACIslyK4B57Z6I0JNll+ng+XGwPxJL41QOD53OL7gSbCjBeS3YYFQRcZa1BjUIC54gtv6y06qSdTkbeU/6wxz4TvJ6pH+UH4CVNVIGfoeJ+DCYZcbEJ7OJ0mXqWtW8bS0nAAeuw9qAfGjYC/Jj9emQrLnzu82Fh2nSDWbahOdyiS5NmFLum3gD7KSwyg/3ST/NpTe+dnpebVok46+aVvy/zmw8E0KAn6H2N7yAdpcZ6e4xTzGSsDXg+ri5mAL6c5ZXHc2F0y3zOdFnOHbEV0toVYQAy7712dOF3m8/m4Y/q9cLZqwz2GmYRP7u49Cbv27iMs19Em4JP2zFRZ18mMLi3HzaszleGcUSI9R8oqFP/opQkv3qL2t8fSbMEakKJhpTduWazjUvPzbcOIbwt5RfQ0UuCMv/mQMV2fW0TgR51z2zoL1vMdssUC8wh7K6mI4S/W2r0ausp/GBF3O+BRS5LFjHpKy+C+gM8uFVVMHaItRmIifShrKudLoCmQtECCNYpHgF+w== teststaging'
      }
    },

  // Options to be passed to Jasmine-node
  onPrepare: function () {
    browser.driver.manage().window().setSize(1920, 1080);

    // JUnit test result xml output reporter
    var jasmineReporters = require('jasmine-reporters');
    var options = {
      savePath: 'build/reports',
      consolidate: true,
      useDotNotation: true,
      filePrefix: 'junit-testresults-e2e'
    };
    var junitReporter = new jasmineReporters.JUnitXmlReporter(options);
    jasmine.getEnv().addReporter(junitReporter);

    // HTML Screenshot reporter
    var HtmlReporter = require('protractor-jasmine2-screenshot-reporter');
    var htmlOptions = {
      dest: 'build/reports/screenshots',
      filename: 'index.html',
      reportOnlyFailedSpecs: false,
      captureOnlyFailedSpecs: true,
      metadataBuilder: function(currentSpec, suites, browserCapabilities) {
        return { id: currentSpec.id, os: browserCapabilities.get('browserName') };
      }
    };
    var screenReporter = new HtmlReporter(htmlOptions);
    jasmine.getEnv().addReporter(screenReporter);
  },

  jasmineNodeOpts: {

    // onComplete will be called just before the driver quits.
    onComplete: null,
    // If true, display spec names.
    isVerbose: true,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 240000
  }
};
