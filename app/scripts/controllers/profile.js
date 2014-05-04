'use strict';

angular.module('11thhourApp')
  .controller('ProfileCtrl', function ($scope, Profile, Events, $rootScope, $routeParams) {

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




    $scope.find = function() {
      var username = ($routeParams).username;
      console.log(username);

      Events.query({ username: username}, function(event) {
        $scope.event = event;
        console.log(event.creator.username);
      });
        
    };



  });






