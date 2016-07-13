/* global printStackTrace: true */
'use strict';
/**
  * @ngdoc service
  * @name yaMaps.service:logService
  * @module yaMaps
  * @kind service
  * @requires $window
  * @requires yaMaps.objects:globals
  *
  * @description
  * Central service for wrapping Angular's $log calls and extending if with the following
  * features:
  *
  * * enable debug messages on the fly with `$log.toggleDebug()`
  * * prefixes log messages with a date (MM/dd HH:mm:ss.sss)
  * * stores the last N API calls, log messages and exceptions
  * * generates diagnostic messages about app state and browser environment on request
  *
  * In order to intercept Angular's $log, run the following code at application config time
  *```
  *  // replace $log service with our own version
  *  $provide.decorator('$log', ['$delegate', 'logService', function ($delegate, logService) {
  *
  *    // $delegate is the original $log service which we forward calls to
  *    logService.setDelegate($delegate);
  *
  *    // return our service instance
  *    return logService;
  *  }]);
  *```
  */
angular.module('yaMaps')

.factory('logService', [ '$injector', function ($injector) {

  // dependencies
  var $document    = $injector.get('$document');
  var $window      = $injector.get('$window');
  var $filter      = $injector.get('$filter');
  var globals      = $injector.get('globals');
  var dateFilter   = $filter('date');
  var appVersion   = $injector.get('version'); // frontend version
  var forEach      = angular.forEach;
  var copy         = angular.copy;

  var lastLogMessages = [];
  var lastExceptions = [];
  var lastCalls = [];
  var maxlen = globals.keepMessages || 10;
  var $delegateService = null;

  var service = {
    debugEnabled: globals.debug,
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#toggleDebug
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Toggles debug logging (everything logged through `$log.debug`) on or off.
      *
      * @returns {boolean} True when debugging is enabled now.
      */
    toggleDebug: function () {
      service.debugEnabled = !service.debugEnabled;
      service.info('Debug ' + (service.debugEnabled ? 'enabled' : 'disabled'));
      return service.debugEnabled;
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#setDelegate
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Sets a delegate service which will be called on each log function.
      * Used to intercept $log service.
      *
      * @param {Object} svc  The Angular service to delegate calls to once processed by logService.
      */
    setDelegate: function(svc) {
      $delegateService = svc;
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#logException
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Logs an exception.
      *
      * @param {Object} e  A user-defined exception object.
      */
    logException: function (e) {
      lastExceptions.push(e);
      if (lastExceptions.length > maxlen) {
        lastExceptions.unshift();
      }
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#callSuccess
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Logs (i.e. internally stores) successful API calls. Internally called
      * by logInterceptor.
      *
      * @param {Object} config  $http call config.
      */
    callSuccess: function (config) {
      // ignore template loading via $http
      if (config.config.url.indexOf('http') !== 0) { return; }

      // store call
      //   time  status  url            error message
      //   000   200     /workspaces    null
      //   001   403     /users/self    {}
      var q = encodeQuery(config.config.params);
      lastCalls.push({
        timestamp: new Date().getTime(),
        status: config.status,
        method: config.config.method,
        url: config.config.url + (q ? '?' + q : ''),
        error: null
      });

      if (lastCalls.length > maxlen) {
        lastCalls.unshift();
      }
    },

    /**
      * @ngdoc method
      * @name yaMaps.service:logService#callFailed
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Logs (i.e. internally stores) unsuccessful API calls. Internally called
      * by logInterceptor.
      *
      * @param {Object} config $http call rejection object.
      */
    callFailed: function (rejection) {
      // Note: Browsers do not provide proper rejection.status on gateway errors
      //       and network failures, i.e. status = 0 then
      var url = rejection.config.url;
      var q = encodeQuery(rejection.config.params);
      var status = rejection.status;
      var apiError = null;

      if (rejection.data) {
        apiError = rejection.status ? rejection.data.errors : null;
      }

      lastCalls.push({
        timestamp: new Date().getTime(),
        status: status,
        headers: rejection.headers,
        method: rejection.config.method,
        url: url + (q ? '?' + q : ''),
        error: apiError
      });

      if (lastCalls.length > maxlen) {
        lastCalls.unshift();
      }
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#getExceptions
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Returns an array of the most recent exceptions. An exception has
      * the following structure:
      *
      * - **timestamp** - `{string}` UNIX time in ms
      * - **message** - `{string}` exception message
      * - **stackTrace** - `{string}` JS stack trace if available
      * - **cause** - `{string}` exception cause if available
      *
      * @returns {Array} Array of exception objects.
      */
    getExceptions: function () {
      return lastExceptions;
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#getMessages
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Returns an array of the most recent log messages.
      *
      * @returns {Array[<string>]} Array of log message strings.
      */
    getMessages: function () {
      return lastLogMessages;
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#getCalls
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description  Returns an array of the most recent API calls. A call object has
      * the following structure:
      *
      * - **timestamp** - `{string}` UNIX time in ms of the call end
      * - **status** - `{string}` HTTP status code
      * - **headers** - `{Array<string>}` HTTP headers
      * - **method** - `{string}` HTTP method
      * - **url** - `{string}` HTTP URL inclduing query parameters
      * - **error** - `{Object}` Returned API error object or null on success.
      *
      * @returns {Array} Array of API call objects.
      */
    getCalls: function () {
      return lastCalls;
    },
    /**
      * @ngdoc method
      * @name yaMaps.service:logService#getDiagnosticMessage
      * @methodOf yaMaps.service:logService
      * @kind function
      *
      * @description Returns full context info about browser, user, application state
      * and recent history of log messages, exceptions and API calls.
      *
      */
    getDiagnosticMessage: function () {
      var now = new Date().getTime();
      return {
        timestamp:  now,
        location:   $injector.get('$location').path(),
        user:       copy($injector.get('authService').getUser()),
        version:    appVersion,
        config:     copy(globals),
        timing:     getTiming(now),
        env:        getEnvironment(),
        calls:      copy(lastCalls),
        log:        copy(lastLogMessages),
        exceptions: copy(lastExceptions)
      };
    }
  };

  // add service methods
  forEach(['warn', 'error', 'info', 'debug', 'log'], function (name){
    service[name] = function() {

      // log debug messages only when state debug is enabled
      if (!service.debugEnabled && name === 'debug') { return; }

      // slice all JS function call arguments into an array
      var args = [].slice.call(arguments),
          now  = dateFilter(new Date(), 'MM/dd HH:mm:ss.sss');

      // prepend timestamp
      if (angular.isString(args[0])) {
        args[0] = supplant("{0} - {1}", [ now, args[0] ]);
      } else {
        args.unshift(now);
      }

      // store last N log messages
      lastLogMessages.push(formatMessage(name, args));
      if (lastLogMessages.length > maxlen) {
        lastLogMessages.unshift();
      }

      // call the original service
      $delegateService[name].apply(null, args);
    };
  });

  // from Douglas Crockford's Remedial JavaScript http://javascript.crockford.com/remedial.html
  function supplant (s, o) {
    return s.replace(/{([^{}]*)}/g,
      function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  }

  // from AngularJS log.js
  function formatError (arg) {
    if (arg instanceof Error) {
      if (arg.stack) {
        arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ?
            arg.message + '\nTrace: ' + arg.stack : arg.stack;
      } else if (arg.sourceURL) {
        arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
      }
    }
    return arg;
  }

  function formatMessage (name, args) {
    var a = [];
    // expand real errors into stack trace
    forEach(args, function (arg) { a.push(formatError(arg)); });
    return a.join(' ');
  }

  function getTiming (now) {
    var performance = $window.performance || $window.webkitPerformance ||
      $window.msPerformance || $window.mozPerformance;
    if (!performance) { return null; }
    var t = performance.timing;
    return {
      appCacheTime: t.domainLookupStart - t.fetchStart,
      redirectTime: t.redirectEnd ? t.redirectEnd - t.navigationStart : 0,
      domainLookupTime: t.domainLookupEnd - t.domainLookupStart,
      serverConnectionTime: t.connectEnd - t.connectStart,
      serverResponseTime: t.responseStart - t.requestStart,
      pageDownloadTime: t.responseEnd -  t.responseStart,
      domInteractiveTime: t.domInteractive - t.navigationStart,
      contentLoadTime: t.domContentLoadedEventStart - t.navigationStart,
      pageLoadTime: t.loadEventEnd - t.fetchStart,
      appRuntime: now - t.loadEventEnd
    };
  }

  function getEnvironment () {
    var nav = $window.navigator;
    var scr = $window.screen.width + ' x ' + $window.screen.height + ':' + $window.screen.pixelDepth;
    var w = Math.max($document[0].documentElement.clientWidth, $window.innerWidth || 0);
    var h = Math.max($document[0].documentElement.clientHeight, $window.innerHeight || 0);
    var viewPort = w + ' x ' + h;
    return {
      platform: nav.platform,
      cpu: nav.oscpu,
      browser: nav.userAgent,
      vendor: nav.vendor,
      cookies: nav.cookieEnabled,
      dnt: nav.doNotTrack,
      language: nav.language,
      online: nav.onLine,
      screenResolution: scr,
      viewportSize: viewPort
    };
  }

  function encodeUriQuery (val) {
    return encodeURIComponent(val).
               replace(/%40/gi, '@').
               replace(/%3A/gi, ':').
               replace(/%24/g, '$').
               replace(/%2C/gi, ',').
               replace(/%3B/gi, ';').
               replace(/%20/g, '+');
  }

  function encodeQuery (q) {
    var a = [];
    angular.forEach(q, function (val, key) {
      if (!val) { return; }
      a.push(key.toString() + '=' + encodeUriQuery(val));
    });
    return a.join('&');
  }

  return service;
}])

/**
  * @ngdoc service
  * @name yaMaps.service:traceService
  * @module yaMaps
  * @kind service
  *
  * @description
  * Micro-Service that wraps stackTrace.js printStackTrace() method.
  *
  */
.factory('traceService', function () {
  return ({
    print: printStackTrace || angular.noop
  });
})

/**
  * @ngdoc service
  * @name yaMaps.service:$exceptionHandler
  * @module yaMaps
  * @kind service
  * @requires yaMaps.services:logService
  * @requires yaMaps.services:traceService
  *
  * @description
  * Override Angular's built in exception handler, and tell it to preserve the
  * default behaviour (logging to the console) but also store the error
  * after generating a stacktrace.
  *
  */
.factory('$exceptionHandler', [ '$injector', function ($injector) {

  function error (exception, cause) {

    var logService   = $injector.get('logService');
    var traceService = $injector.get('traceService');

    // preserve the default behaviour which will log the error
    // to the console, and allow the application to continue running.
    logService.error.apply(logService, arguments);

    // now try to log the error to the server side.
    try {

      // use traceService to generate a stack trace
      logService.logException({
        timestamp: new Date().getTime(),
        message: exception.toString(),
        stackTrace: traceService.print({ e: exception }),
        cause: ( cause || '')
      });

    } catch (loggingError){
      logService.warn('Error exception handling failed');
      logService.log(loggingError);
    }
  }

  return (error);

}]);
