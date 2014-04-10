'use strict';

angular.module('11thhourApp')
  .factory('Profile', function ($resource) {
    return $resource('api/profile/:userId/:dest', {
      userId: '@_id'
    });
  });