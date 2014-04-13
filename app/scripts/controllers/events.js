'use strict';

angular.module('11thhourApp')
  .controller('EventsCtrl', function ($scope, Events, $location, $routeParams, $rootScope) {

    $scope.categories = ['food', 'rideshare', 'haha'];
    $scope.selectionCategories = [];
    $scope.showFilters = false;

    // toggle selection for a given category by name
    $scope.toggleSelection = function toggleSelection(category, type) {
      var idx = $scope.selectionCategories.indexOf(category);

      // is currently selected
      if (idx > -1) {
        $scope.selectionCategories.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selectionCategories.push(category);
      }
      if (type === 'filter') {
        $scope.filters();
      }
    };

    $scope.joinEvent = function($event) {
      var checkbox = $event.target;
      var event = $scope.event;
      var joinType = (checkbox.checked) ? 'join' : 'unjoin';
      $scope.join(joinType);
    };

    $scope.filters = function() {
      if (this.selectionCategories.length == 0) {
        $location.search({}).path('/');
      }
      else {
        $location.search({ categories: this.selectionCategories.join() }).path('search');
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
      $location.path('/');
    };

    $scope.update = function() {
      var event = $scope.event;
      event.$update(function() {
        $location.path('events/' + event._id);
      });
    };

    $scope.join = function(joinType){
      var event = $scope.event;
      event.$join({
        eventId: event._id,
        dest: joinType
      }, function(events){
          $location.path('events/' + event._id);
        }
      );
    };

    $scope.find = function() {
      var username = ($routeParams).username;
      var eventsType = ($routeParams).eventsType;
      var categories = ($location.search()).categories;
      
      populateCategories(categories);

      $scope.showFilterbar = (username === undefined);
      $scope.showFilters = (categories !== undefined);

      Events.query({ username: username, eventsType: eventsType, categories: categories }, function(events) {
        $scope.events = events;
      });
        
    };

    function populateCategories(categories) {
      if (categories === undefined) {
        return;
      }
      categories = categories.split(',');
      for (var i in categories) {
        $scope.selectionCategories.push(categories[i]);
      }
    }

    $scope.findOne = function() {
      Events.get({
        eventId: $routeParams.eventId
      }, function(event) {
        $scope.event = event;
        
        if ($rootScope.currentUser !== null) {
          var index = event.attendees.indexOf($rootScope.currentUser.username);
          if (index > -1) {
            $scope.joinCheckbox = true;
          }
        }
      });
    };

    $scope.isCategoryActive = function(category) {
      var idx = $scope.selectionCategories.indexOf(category);
      return (idx > -1);
    };


    $scope.addComment = function(){
      if (this.newComment === undefined) {
        return;
      }
      var event = $scope.event;
      event.$addComment({
        eventId: event._id,
        dest: 'addComment',
        text: this.newComment
      }, function(events){
          $scope.event = event;
        }
      );
    };
  });
