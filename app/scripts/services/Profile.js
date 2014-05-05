'use strict';

angular.module('11thhourApp')
  .factory('Profile', function ($resource) {
    return $resource('api/profile/:username', {
      username: '@_id'
    }, {
      find: {
        method: 'GET', 
        isArray: false
      }
    });
  });
