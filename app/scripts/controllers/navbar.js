'use strict';

angular.module('11thhourApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location) {
    $scope.menu = [{
      "title": "Events",
      "link": "events"
    }];

    $scope.authMenu = [{
      "title": "Create New Event",
      "link": "events/create"
    }];

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });
