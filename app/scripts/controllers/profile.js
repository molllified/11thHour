'use strict';

angular.module('11thhourApp')
  .controller('ProfileCtrl', function ($scope, Profile, $rootScope) {


    $scope.filters = function($event) {
      $location.path('search').search({ categories: this.selectionCategories.join() });
    };

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






