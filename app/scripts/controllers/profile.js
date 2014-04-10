'use strict';

angular.module('11thhourApp')
  .controller('ProfileCtrl', function ($scope, Profile, $rootScope) {

    $scope.eventsCreated = function(){
      Profile.query({
        userId: $rootScope.currentUser.username,
        dest: 'eventsCreated'
      }, function(events){
          $scope.events = events;
        });
    };

    $scope.eventsJoined = function(){
      Profile.query({
        userId: $rootScope.currentUser.username,
        dest: 'eventsJoined'
      }, function(events){
          $scope.events = events;
        });
    };
  	
  });






