'use strict';

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'build/bower_components/jquery/dist/jquery.js',
      'build/bower_components/angular/angular.js',
      'build/bower_components/angular-mocks/angular-mocks.js',
      // 'build/bower_components/angular-resource/angular-resource.js',
      'build/bower_components/angular-cookies/angular-cookies.js',
      'build/bower_components/angular-sanitize/angular-sanitize.js',
      'build/bower_components/angular-route/angular-route.js',
      'build/bower_components/angular-messages/angular-messages.js',
      // 'build/bower_components/angular-translate/angular-translate.js',
      // 'build/bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      // 'build/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      // 'build/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'build/bower_components/angular-scroll/angular-scroll.js',
      // 'build/bower_components/ngDialog/js/ngDialog.js',
      'build/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      // 'build/bower_components/angular-ui-select/dist/select.js',
      'build/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      // 'build/bower_components/showdown/src/showdown.js',
      // 'build/bower_components/ngmap/build/scripts/ng-map.js',
      // 'build/bower_components/jsoneditor/dist/jsoneditor.js',
      // 'build/bower_components/ng-jsoneditor/ng-jsoneditor.js',
      // 'build/bower_components/angular-touch/angular-touch.js',
      'build/scripts/app.js',
      'build/scripts/constants.js',
      'build/scripts/templates.html.js',
      // 'build/scripts/templates.md.js',
      // 'build/scripts/templates.json.js',
      'build/scripts/conf-*.js',
      'build/scripts/*/*.js',
      'test/spec/**/*.js'
      // fixtures
      // {
      //   pattern: 'test/fixtures/**/*.{json,html}',
      //   watched: true,
      //   served: true,
      //   included: false
      // }
    ],

    // list of files / patterns to exclude
    exclude: [],

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage', 'junit'],

    // junit output
    junitReporter: {
      outputFile: 'build/reports/test-results.xml'
    },

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests, libraries or template cache files
      // (these files will be instrumented by Istanbul)
      'build/scripts/**/!(*html|*json|*md).js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      // specify a common output directory
      dir : 'build/coverage/',
      includeAllSources: true,
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' }
      ]
    },

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
