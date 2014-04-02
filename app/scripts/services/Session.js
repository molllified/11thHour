'use strict';

angular.module('11thhourApp')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });
