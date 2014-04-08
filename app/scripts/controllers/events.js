'use strict';

angular.module('11thhourApp')
  .controller('EventsCtrl', function ($scope, Events, $location, $routeParams, $rootScope) {

    $scope.categories = ['food', 'rideshare', 'haha'];
    $scope.selectionCategories = [];

    // toggle selection for a given category by name
    $scope.toggleSelection = function toggleSelection(category) {
      var idx = $scope.selectionCategories.indexOf(category);

      // is currently selected
      if (idx > -1) {
        $scope.selectionCategories.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selectionCategories.push(category);
      }
    };

    $scope.joined = false;

    $scope.join = function() {
      var event = $scope.event;
      if($scope.joined == false){
        $scope.joined = true;
        if(event.attendees === undefined){
          console.log("hello attendees");
          event.attendees = [];
        }
        console.log(event.attendees);
        event.attendees.push($rootScope.currentUser.username);
        console.log(event.attendees);
        $scope.joinUpdate();
      }
      else{
        $scope.joined = false;
      }
    };


    $scope.create = function() {
      var event = new Events({
        title: this.title,
        description: this.description,
        time: this.time,
        location: this.location,
        price: this.price,
        peopleNeeded: this.peopleNeeded,
        attendees: this.attendees,
        categories: this.selectionCategories
      });
      event.$save(function(response) {
        $location.path("events/" + response._id);
      });

      this.title = "";
      this.description = "";
      this.time = "";
      this.location = "";
      this.price = "";
      this.peopleNeeded = "";
      this.attendees = "";
      this.categories = "";

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

    $scope.joinUpdate = function() {
      var event = $scope.event;
      event.$update(function() {
        $location.path('events/' + event._id + '/join');
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
