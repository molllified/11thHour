'use strict';

angular.module('11thhourApp')
  .factory('Events', function ($resource) {
    return $resource('api/events/:eventId/:dest', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT',
        params: {dest: ''}
      },
      join: {
        method: 'PUT',
        params: {dest: 'join'}
      },
      unjoin: {
        method: 'PUT',
        params: {dest: 'unjoin'}
      }
    });
  });
