'use strict';

angular.module('11thhourApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location) {

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });
