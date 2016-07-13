'use strict';
/**
 * @ngdoc controller
 * @name yaMaps.controller:UserCtrl
 * @module yaMaps
 * @kind controller
 * @requires $location
 * @requires ngDialog
 * @requires $log
 * @requires $q
 * @requires yaMaps.resources.service:User
 * @requires yaMaps.resources.service:Auth
 * @requires yaMaps.service:authService
 * @requires yaMaps.objects:globals
 *
 * @description
 * Controller for managing user-related actions like login, email, password and user lifecycle.
 *
 */
angular.module('yaMaps')
.controller('UserCtrl', [ '$scope', '$injector', function ($scope, $injector) {

  // 1 self reference
  var controller = this;

  // 2 requirements
  var $location        = $injector.get('$location');
  // var ngDialog         = $injector.get('ngDialog');
  // var $q               = $injector.get('$q');
  // var authService      = $injector.get('authService');
  var globals          = $injector.get('globals');
  // var Auth             = $injector.get('Auth');
  // var User             = $injector.get('User');
  // var extend           = angular.extend;
  var $log = $injector.get('$log');
  var log = globals.debug ? angular.bind(null, $log.debug, 'C[UserCtrl]') : angular.noop;

  // var $log             = $injector.get('$log');
  // var log              = globals.debug ? angular.bind(null, $log.debug, 'C[User]') : angular.noop;

  // 3 Do scope stuff
  // 3a Set up watchers on the scope
  // 3b Expose methods or data on the scope
  // 3c Listen to events on the scope

  // login session expired for some reason
  $scope.$on('login.expired', init);

  // login was successful
  $scope.$on('login.success', init);

  // 4 Expose methods and properties on the controller instance
  this.data = {}; // name, password
  this.willRedirect = !!$location.search().redirectTo;
  this.usernamePolicy = new RegExp(globals.usernamePolicy);
  this.passwordPolicy = new RegExp(globals.passwordPolicy);

  this.user = null;

  // 5. Clean up
  $scope.$on('$destroy', function () {
    // Do whatever cleanup might be necessary
    controller = null; // MEMLEAK FIX
    $scope = null;     // MEMLEAK FIX
  });

  init();

  // 6. All the actual implementation goes here
  function init () {

    log('init()');
    controller.data = {};

  }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#login
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Performs user login via the {@link yaMaps.service:authService AuthService}. This method
    * uses the following data fields exported by the controller:
    *
    * - **data.name** - `{string}` user name
    * - **data.password** - `{string}` user password
    *
    * Redirects to user's dashboard on success.
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function login (callState) {
  //   callState.start();
  //   return authService.login(controller.data.name, controller.data.password)
  //   .then(callState.success, callState.failed)
  //   .then(
  //     function () {
  //       // redirect the user to /dashboard or redirectTo URL param
  //       var redirectTo = $location.search().redirectTo || globals.redirectOnLogin;
  //       $location.path(redirectTo).search({ redirectTo:null });
  //     }
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#logout
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Performs user logout via the {@link yaMaps.service:authService AuthService}.
    *
    */
  // function logout () {
  //   authService.logout()['finally'](
  //     function () {
  //       controller.user = null;
  //     }
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#create
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Performs user create via the {@link yaMaps.service:authService AuthService}. This method
    * uses the following data fields exported by the controller:
    *
    * - **data.name** - `{string}` user name
    * - **data.password** - `{string}` user password
    * - **data.email** - `{string}` user's email address (must be same as in registration/create link)
    * - **data.inviteCode** - `{string}` invitation code (as sent in create link)
    * - **data.newsletter** - `{boolean}` subscribe to newsletter
    * - **data.tosAccepted** - `{boolean}` user accepted Terms of Service
    *
    * Logs in user and redirects to user's dashboard on success.
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function create (callState) {
  //   callState.start();
  //   return authService.create({
  //     'userName': controller.data.name,
  //     'password': controller.data.password,
  //     'email': controller.data.email,
  //     'inviteCode': controller.data.invite,
  //     'newsletter': controller.data.newsletter,
  //     'tosAccepted': controller.data.tosAccepted,
  //     // 'firstName': controller.data.firstname,
  //     // 'lastName': controller.data.lastname,
  //     // 'company': controller.data.company,
  //     // 'country': controller.data.country
  //   })
  //   .then(login, callState.failed);
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#register
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Registers a user's email address for invitation via {@link yaMaps.service:authService AuthService}.
    * This method uses the following data fields exported by the controller:
    *
    * - **data.email** - `{string}` user's email address
    *
    * Opens ngDialog on success which asks for newsletter create.
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function register (callState) {
  //   callState.start();
  //   return authService.register(controller.data.email)
  //   .then(callState.success, callState.failed)
  //   .then(
  //     function (registration) {
  //       controller.data = {};
  //       return ngDialog.open({
  //         templateUrl: 'dialogs/registration.html',
  //         className: 'ngdialog-theme-plain',
  //         data: registration
  //       }).closePromise.then(function () {
  //           if (registration.newsletter) {
  //             return registration.$update();
  //           } else {
  //             return $q.when();
  //           }
  //         }
  //       );
  //     }
  //   )
  //   .then(
  //     function () { $location.url('/'); },
  //     init
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#changeEmail
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Requests to change a user's email address. This is step one of a two-step process.
    * When successful, the API backend will send a message to the new email address which
    * contains a unique verification code. Verification is handled by the
    * {@link yaMaps.controller:EmailVerifyCtrl EmailVerifyCtrl}.
    *
    * This method uses the following data fields exported by the controller:
    *
    * - **data.email** - `{string}` user's new email address
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function changeEmail (callState) {
  //   if (!controller.user) { return $q.reject(); }
  //   callState.start();
  //   // use class function here to avoid $resource overwrite
  //   return User.resendEmail(
  //     { userId: controller.user.userId },
  //     { email: controller.data.email }
  //   ).$promise.then(
  //     // ignore return value (= email reset token)
  //     callState.success,
  //     // use return error code to render failure message
  //     callState.failed
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#changeProfile
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Changes a user's profile data and starts email address verification in case the address was altered.
    *
    * This method uses the following data fields exported by the controller:
    *
    * - **user** - `{object}` user object
    * - **data.email** - `{string}` user's new email address
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function changeProfile (callState) {
  //   if (!controller.user) { return; }

  //   var promises = [];

  //   // changes in email require a different procedure
  //   callState.start();
  //   if (controller.data.email !== controller.user.email) {
  //     promises.push(User.resendEmail(
  //       { userId:controller.user.userId },
  //       { email:controller.data.email }
  //     ).$promise);
  //   }

  //   // run other updates through PUT (User.update())
  //   promises.push(controller.user.$update());

  //   // wait for all promises
  //   return $q.all(promises).then(
  //     // ignore return value (= email reset token)
  //     callState.success,
  //     // use return error code to render failure message
  //     callState.failed
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#verifyEmail
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Performs email address verification based on the information received via a
    * confirmation link.
    *
    * This route may be called with or without a logged in user. On success the
    * user is redirected to dashboard (when logged in) or home (when not logged in).
    *
    * The method uses the following data fields exported by the controller:
    *
    * - **data.userId** - `{string}` id of the user to verify
    * - **data.email** - `{string}` user's new email address
    * - **data.token** - `{string}` unique verification token
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function verifyEmail (userId, token, email, callState) {
  //   callState = callState || $scope.callState;
  //   callState.start();
  //   return User.verifyEmail(
  //     { userId: userId || controller.data.userId },
  //     {
  //       token: token || controller.data.token,
  //       email: email || controller.data.email
  //     })
  //     .$promise.then(callState.success, callState.failed)
  //     .then(
  //       function (result) {
  //         // update the logged in user object if exists
  //         if (controller.user) {
  //           extend(controller.user, result);
  //         }
  //         return result;
  //       }
  //     )
  //     ['finally'](function (){
  //       var redirectTo = controller.user ? '/dashboard' : '/';
  //       // clears all search parameters
  //       $location.url(redirectTo);
  //     });
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#closeAccount
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Closes a user's account.
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function closeAccount (callState) {
  //   callState = callState || $scope.callState;
  //   if (!controller.user) { return $q.reject(); }
  //   callState.start();
  //   return authService.closeAccount(controller.data.currentPwd)
  //   .then(callState.success, callState.failed)
  //   .then(function () {
  //     $location.url('/'); return true;
  //   });
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#changePwd
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Performs password change for logged-in user.
    *
    * The method uses the following data fields exported by the controller:
    *
    * - **data.currentPwd** - `{string}` user's current password
    * - **data.password** - `{string}` user's new password
    *
    * @returns {Promise}  API call promise that resolves to a {@link yaMaps.resources.service:User User} object
    *                     or [error object](./guide/concepts) on failure.
    */
  // function changePwd (callState) {
  //   if (!controller.user) { return $q.reject(); }
  //   // use class method here to avoid password leakage through URL
  //   callState.start();
  //   return User.passwd({ userId: controller.user.userId }, {
  //     oldPassword: controller.data.currentPwd,
  //     newPassword: controller.data.password,
  //   }).$promise
  //   .then(callState.success, callState.failed)
  //   .then(
  //     // ignore return value (= email reset token)
  //     function (result) {
  //       extend(controller.user, result);
  //       init();
  //       return controller.user;
  //     }
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#requestPwd
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Requests to change a user's password. The user may not be logged in to perform
    * this operation. This is step one of a two-step process.
    * When successful, the API backend will send a message to the user's known email address which
    * contains a unique reset token. Actual password reset is handled by the
    * {@link yaMaps.controller:PasswordResetCtrl PasswordResetCtrl}.
    *
    * On success this method redirects the user to home (/).
    *
    * This method uses the following data fields exported by the controller:
    *
    * - **data.email** - `{string}` user's email address or user name
    *
    * @returns {Promise}  API call promise that resolves to an empty object or
    * [error object](./guide/concepts) on failure.
    *
    */
  // function requestPwd (callState) {
  //   var isEmail = controller.data.email.indexOf('@') > -1;
  //   callState.start();
  //   return Auth.requestPasswordReset({
  //     userName: isEmail ? undefined : controller.data.email,
  //     email: isEmail ? controller.data.email : undefined
  //   })
  //   .$promise.then(callState.success, callState.failed)
  //   .then(
  //     function () { $location.url('/'); },
  //     init
  //   );
  // }

  /**
    * @ngdoc method
    * @name yaMaps.controller:UserCtrl#resetPwd
    * @methodOf yaMaps.controller:UserCtrl
    * @kind function
    *
    * @description
    * Performs password reset based on a unique token received via email. The user may not be logged in to perform
    * this operation. This is step two of a two-step process.
    *
    * On success this method redirects the user to home (/).
    *
    * The method uses the following data fields exported by the controller:
    *
    * - **data.token** - `{string}` unique password reset token
    * - **data.password** - `{string}` user's new password
    *
    * @returns {Promise}  API call promise that resolves to an empty object or
    * [error object](./guide/concepts) on failure.
    *
    */
  // function resetPwd (callState) {
  //   callState.start();
  //   return Auth.confirmPasswordReset({
  //     token: controller.data.token,
  //     password: controller.data.password
  //   })
  //   .$promise.then(callState.success, callState.failed)
  //   .then(
  //     function () { $location.url('/'); },
  //     init
  //   );
  // }

  // function toggleMenu (open) {
  //   var elem = document.getElementById('side-nav');
  //   if (open) {
  //     elem.style.width = '180px';
  //   } else {
  //     elem.style.width = '90px';
  //   }

  //   console.log('elem ', elem);
  // }
}]);
