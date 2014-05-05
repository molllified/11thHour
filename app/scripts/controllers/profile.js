'use strict';

angular.module('11thhourApp')
  .controller('ProfileCtrl', function ($scope, Profile, $rootScope, $routeParams) {

    $scope.findUser = function(){
      Profile.find({
        username: ($routeParams).username,
      }, function(user){
          $scope.user = user;
        });
    };
  });

