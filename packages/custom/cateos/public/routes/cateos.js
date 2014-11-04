'use strict';

//Setting up route
angular.module('mean.cateos').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all videos', {
        url: '/videos',
        templateUrl: 'cateos/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create video', {
        url: '/videos/create',
        templateUrl: 'cateos/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit video', {
        url: '/videos/:videoId/edit',
        templateUrl: 'cateos/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('video by id', {
        url: '/videos/:videoId',
        templateUrl: 'cateos/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('configuration', {
        url: '/config',
        templateUrl: 'cateos/views/config.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
