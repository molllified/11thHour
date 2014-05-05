'use strict';

angular.module('11thhourApp')
  .controller('EventsCtrl', function ($scope, Events, $location, $routeParams, $rootScope) {

    $scope.showFilters = false;

    // hack <- fix this below
    $scope.categories1 = ['Food', 'Rideshare', 'Outdoors'];
    $scope.categories2 = ['Concerts', 'Fashion', 'Furniture'];
    $scope.categories3 = ['Bars', 'Night', 'Family'];

    $scope.selectedCategories = [];

    $scope.prices = ['Free', '$', '$$', '$$$', '$$$$'];
    $scope.selectedPrice = undefined;

    $scope.selectedLocation = undefined;    

    $scope.toggleCategorySelection = function toggleCategorySelection(category, type) {
      var idx = $scope.selectedCategories.indexOf(category);
      // is currently selected
      if (idx > -1) {
        $scope.selectedCategories.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selectedCategories.push(category);
      }
      if (type === 'filter') {
        $scope.filters();
      }
    };
    $scope.isCategoryActive = function(category) {
      var idx = $scope.selectedCategories.indexOf(category);
      return (idx > -1);
    };


    $scope.togglePriceSelection = function togglePriceSelection(price) {
      if ($scope.selectedPrice !== price) {
        $scope.selectedPrice = price;
      }
    };
    $scope.isPriceActive = function(price) {
      return ($scope.selectedPrice === price);
    };
    $scope.initSelectedPrice = function(price) {
      if (price === $scope.prices[0]) {
        $scope.selectedPrice = price;
      }
    }


    $scope.joinEvent = function($event) {
      var checkbox = $event.target;
      var joinType = ($scope.showGoing) ? 'join' : 'unjoin';
      $scope.join(joinType);
    };

    $scope.filters = function() {
      if (this.selectedCategories.length == 0) {
        $location.search({}).path('/');
      }
      else {
        $location.search({ categories: this.selectedCategories.join() }).path('search');
      }
    };

    $scope.create = function() {
      var price = 0;
      if($scope.selectedPrice !== 'Free'){
        price = $scope.selectedPrice.length;
      }
      else{
        price = 0;
      }
      var event = new Events({
        title: this.title,
        description: this.description,
        time: this.time,
        location: JSON.stringify($scope.selectedLocation),
        price: price,
        peopleNeeded: this.peopleNeeded,
        attendees: this.attendees,
        categories: this.selectedCategories
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
      if($scope.selectedPrice !== 'Free'){
        event.price = $scope.selectedPrice.length;
      }
      else{
        event.price = 0;
      }
      event.location = JSON.stringify($scope.selectedLocation);
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
        $scope.selectedCategories.push(categories[i]);
      }
    }

    $scope.findOne = function() {
      Events.get({
        eventId: $routeParams.eventId
      }, function(event) {
        $scope.event = event;
        displayViewLocationMap(event.location);
        
        if ($rootScope.currentUser !== null) {
          var index = event.attendees.indexOf($rootScope.currentUser.username);
          if (index > -1) {
            $scope.showGoing = true;
          }
        }
      });
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

    $scope.sendEmail = function(){
      if (this.newEmail === undefined) {
        return;
      }

      if (this.recipientEmail === undefined) {
        return;
      }


     var event = $scope.event;
     event.$sendEmail({
        eventId: event._id,
        dest: 'sendEmail',
        text: this.newEmail,
        recipient: this.recipientEmail,
        // sender: this.senderEmail
      }, function(events){
          $scope.event = event;
        }
      );

     this.newEmail = "";
     this.recipientEmail = "";
     this.senderEmail = "";
    };






    // =============
    $scope.initializeCreateLocationMap = function() {
      var mapOptions = {
        center: new google.maps.LatLng(41.826718, -71.40256199999999),
        zoom: 13,
        disableDefaultUI: true
      };
      var map = new google.maps.Map(document.getElementById('createLocationMap'),
        mapOptions);

      var input = /** @type {HTMLInputElement} */(
          document.getElementById('createLocationInput'));

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(15);
        }

        // @type {google.maps.Icon}
        marker.setIcon(({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = 
            (place.address_components[0] && place.address_components[0].short_name || '') + ' ' +
            (place.address_components[1] && place.address_components[1].short_name || '') + ', ' +
            (place.address_components[2] && place.address_components[2].short_name || '');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
        $scope.selectedLocation = place;
      });
    };

    
    function displayViewLocationMap(location) {
      if (location === undefined || location === '') {
        return;
      }
      
      var place = JSON.parse(location);
      if (!place.geometry) {
        return;
      }

      var mapOptions = {
        center: new google.maps.LatLng(place.geometry.location.k, place.geometry.location.A),
        zoom: 15,
        disableDefaultUI: true
      };
      var map = new google.maps.Map(document.getElementById('viewLocationMap'),
        mapOptions);


      // google.maps.event.trigger(map, 'resize');

      /*
      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      // infowindow.close();
      marker.setVisible(false);
      // map.checkResize();
      
      // @type {google.maps.Icon}
      marker.setIcon(({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));

      marker.setPosition(new google.maps.LatLng(place.geometry.location.k, place.geometry.location.A));
      marker.setVisible(true);

      */

      var address = '';
      if (place.address_components) {
        address = 
          (place.address_components[0] && place.address_components[0].short_name || '') + ' ' +
          (place.address_components[1] && place.address_components[1].short_name || '') + ', ' +
          (place.address_components[2] && place.address_components[2].short_name || '');
      }
      $scope.eventLocationAdress = address; // hack. fix this
      $scope.eventLocationName = place.name;   
    };


    



  });
