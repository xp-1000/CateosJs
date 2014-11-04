'use strict';

//Videos service used for videos REST endpoint
angular.module('mean.cateos').factory('Videos', ['$resource',
  function($resource) {
    return $resource('videos/:videoId', {
      videoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Config service used for config REST endpoint
angular.module('mean.cateos').factory('Config', ['$resource',
  function($resource) {
    return $resource('config', {
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);