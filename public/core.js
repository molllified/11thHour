

var app = angular.module('mainApp', 
	['ngRoute', 'mainAppControllers']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/',
    {
    	templateUrl: 'partials/newsFeed.html',
        controller: 'newsFeedController'
    })
    .when('/event/:event_id',
    {
    	templateUrl: 'partials/event.html',
        controller: 'eventController'
    })
    .otherwise({
        redirectTo: '/'
	});
  }
]);





