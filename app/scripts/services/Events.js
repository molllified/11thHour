'use strict';

angular.module('11thhourApp')
  .factory('Events', function ($resource) {
    return $resource('api/events/:eventId/:dest', {
      eventId: '@_id'
    }, {
      query: {
        method: 'GET', 
        isArray: true
      },
      update: {
        method: 'PUT',
        params: {dest: ''}
      },
      join: {
        method: 'PUT'
      },
      addComment: {
        method: 'PUT'
      },
      sendEmail: {
        method: 'PUT'
      }
    });
  });
