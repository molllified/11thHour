'use strict';

angular.module('11thhourApp')
  .factory('Events', function ($resource) {
    return $resource('api/events/:eventId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
