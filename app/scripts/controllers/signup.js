'use strict';

angular.module('11thhourApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.register = function(form) {
      Auth.createUser({
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            $location.path('/');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        }
      );
    };
  });