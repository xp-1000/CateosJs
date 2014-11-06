'use strict';

(function() {
  // Videos Controller Spec
  describe('MEAN controllers', function() {
    describe('VideosController', function() {
      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.videos');
      });

      // Initialize the controller and a mock scope
      var VideosController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        VideosController = $controller('VideosController', {
          $scope: scope
        });

        $stateParams = _$stateParams_;

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      it('$scope.find() should create an array with at least one video object ' +
        'fetched from XHR', function() {

          // test expected GET request
          $httpBackend.expectGET('videos').respond([{
            title: 'An Video about MEAN',
            content: 'MEAN rocks!'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.videos).toEqualData([{
            title: 'An Video about MEAN',
            content: 'MEAN rocks!'
          }]);

        });

      it('$scope.findOne() should create an array with one video object fetched ' +
        'from XHR using a videoId URL parameter', function() {
          // fixture URL parament
          $stateParams.videoId = '525a8422f6d0f87f0e407a33';

          // fixture response object
          var testVideoData = function() {
            return {
              title: 'An Video about MEAN',
              content: 'MEAN rocks!'
            };
          };

          // test expected GET request with response object
          $httpBackend.expectGET(/videos\/([0-9a-fA-F]{24})$/).respond(testVideoData());

          // run controller
          scope.findOne();
          $httpBackend.flush();

          // test scope value
          expect(scope.video).toEqualData(testVideoData());

        });

      it('$scope.create() with valid form data should send a POST request ' +
        'with the form input values and then ' +
        'locate to new object URL', function() {

          // fixture expected POST data
          var postVideoData = function() {
            return {
              title: 'An Video about MEAN',
              content: 'MEAN rocks!'
            };
          };

          // fixture expected response data
          var responseVideoData = function() {
            return {
              _id: '525cf20451979dea2c000001',
              title: 'An Video about MEAN',
              content: 'MEAN rocks!'
            };
          };

          // fixture mock form input values
          scope.title = 'An Video about MEAN';
          scope.content = 'MEAN rocks!';

          // test post request is sent
          $httpBackend.expectPOST('videos', postVideoData()).respond(responseVideoData());

          // Run controller
          scope.create(true);
          $httpBackend.flush();

          // test form input(s) are reset
          expect(scope.title).toEqual('');
          expect(scope.content).toEqual('');

          // test URL location to new object
          expect($location.path()).toBe('/videos/' + responseVideoData()._id);
        });

      it('$scope.update(true) should update a valid video', inject(function(Videos) {

        // fixture rideshare
        var putVideoData = function() {
          return {
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Video about MEAN',
            to: 'MEAN is great!'
          };
        };

        // mock video object from form
        var video = new Videos(putVideoData());

        // mock video in scope
        scope.video = video;

        // test PUT happens correctly
        $httpBackend.expectPUT(/videos\/([0-9a-fA-F]{24})$/).respond();

        // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
        //$httpBackend.expectPUT(/videos\/([0-9a-fA-F]{24})$/, putVideoData()).respond();
        /*
                Error: Expected PUT /videos\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Video about MEAN","to":"MEAN is great!"}
                GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Video about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                */

        // run controller
        scope.update(true);
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/videos/' + putVideoData()._id);

      }));

      it('$scope.remove() should send a DELETE request with a valid videoId ' +
        'and remove the video from the scope', inject(function(Videos) {

          // fixture rideshare
          var video = new Videos({
            _id: '525a8422f6d0f87f0e407a33'
          });

          // mock rideshares in scope
          scope.videos = [];
          scope.videos.push(video);

          // test expected rideshare DELETE request
          $httpBackend.expectDELETE(/videos\/([0-9a-fA-F]{24})$/).respond(204);

          // run controller
          scope.remove(video);
          $httpBackend.flush();

          // test after successful delete URL location videos list
          //expect($location.path()).toBe('/videos');
          expect(scope.videos.length).toBe(0);

        }));
    });
  });
}());
