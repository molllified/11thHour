'use strict';

angular.module('11thhourApp')
  .controller('EventsCtrl', function ($scope, Events, $location, $routeParams, $rootScope) {

    $scope.create = function() {
      var event = new Events({
        title: this.title,
        content: this.content
      });
      event.$save(function(response) {
        $location.path("events/" + response._id);
      });

      this.title = "";
      this.content = "";
    };

    $scope.remove = function(event) {
      event.$remove();

      for (var i in $scope.events) {
        if ($scope.events[i] == event) {
          $scope.events.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      var event = $scope.event;
      event.$update(function() {
        $location.path('events/' + event._id);
      });
    };

    $scope.find = function() {
      Events.query(function(events) {
        $scope.events = events;
      });
    };

    $scope.findOne = function() {
      Events.get({
        eventId: $routeParams.eventId
      }, function(event) {
        $scope.event = event;
      });
    };
  });
