'use strict';

angular.module('11thhourApp')
  .controller('TopbarCtrl', function ($scope, Auth, $location) {
    $scope.menu = [

    {
      "title": "Filters",
      "link": "filters"
    }

    ];

  });

