'use strict';

angular.module('11thhourApp')
  .controller('ProfileCtrl', function ($scope, Profile, $rootScope) {


    $scope.findMyEventsList = function(){
      Profile.query({
        userId: $rootScope.currentUser.username,
        dest: 'findMyEventsList'
      }, function(events){
          $scope.events = events;
        });
      };

    $scope.findEventsAttending = function(){
      Profile.query({
        userId: $rootScope.currentUser.username,
        dest: 'findEventsAttending'
      }, function(events){
          $scope.events = events;
        });
      };
  	
  });






