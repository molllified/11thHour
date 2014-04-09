'use strict';

angular.module('11thhourApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/events/list.html',
        controller: 'EventsCtrl'
      })
      .when('/events/create', {
        templateUrl: 'partials/events/create.html',
        controller: 'EventsCtrl'
      })
      .when('/events/:eventId/edit', {
        templateUrl: 'partials/events/edit.html',
        controller: 'EventsCtrl'
      })
      .when('/events/:eventId', {
        templateUrl: 'partials/events/view.html',
        controller: 'EventsCtrl'
      })
      .when('/search', {
        templateUrl: 'partials/events/list.html',
        controller: 'EventsCtrl'
      })
      .when('/filters', {
        templateUrl: 'partials/events/filters.html',
        controller: 'EventsCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })

  .run(function ($rootScope, $location, Auth) {

    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/login', '/logout', '/signup', '/profile'].indexOf($location.path()) == -1 )) {
        Auth.currentUser();
      }
    });

    // On catching 401 errors, redirect to the login page.
    $rootScope.$on('event:auth-loginRequired', function() {
      $location.path('/login');
      return false;
    });
  });