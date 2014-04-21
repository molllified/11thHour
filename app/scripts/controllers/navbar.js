'use strict';

angular.module('11thhourApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location, $resource) {

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };

    $scope.facebooklogin = function() {
    	console.log('navbar controller facebooklogin');
    	var facebook = $resource('/auth/facebook');
    	facebook.get(function(res) {
    		console.log('navbar controller facebook call back');
    		console.log(res);
    	})
    }
  });
