'use strict';

angular.module('11thhourApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location) {
    $scope.menu = [

/*
    {
      "title": "Events",
      "link": "events"
    }
*/
    ];

    $scope.authMenu = [{
      "title": "Create New Event",
      "link": "events/create"
    }, 
    {
      "title": "My Events List",
      "link": "user/findMyEventsList"
    }, 
    {
      "title": "Events Attending",
      "link": "user/eventsAttending"
    }];


    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });
