'use strict';


angular.module('mean.cateos').controller('VideosController', ['$scope', '$stateParams', '$location', 'Global', 'Videos',
	function($scope, $stateParams, $location, Global, Videos) {
		$scope.global = Global;  
		$scope.layout = 'grid';
		$scope.rate = 5;
		// Choice list for multi select fields
		// TODO : Dynamic list loaded from external class 
		$scope.inputGenres = [
			{name:'Action',        ticked: false},
			{name:'Romance',        ticked: false},
			{name:'Science Fiction',        ticked: false},
			{name:'Comedie',        ticked: false},
			{name:'Drame',        ticked: false}
		];  
		$scope.inputNationalities = [
			{name:'French',        ticked: false},
			{name:'English',        ticked: false},
			{name:'Spanish',        ticked: false},
			{name:'German',        ticked: false}
		];  
		$scope.stars = [{id: 'star1', name:''}];


		// functions for date picker
		$scope.today = function() {
			$scope.date = new Date();
		};

		$scope.clearDate = function () {
			$scope.date = null;
		};

		$scope.openDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = true;
		};

		// function for add another star button
		$scope.addStar = function() {
			var item = $scope.stars.length+1;
			$scope.stars.push({'id':'star'+item, 'name':''});
		};

		$scope.removeStar = function() {
			if($scope.stars.length > 1)
				$scope.stars.pop();
		};

		$scope.showStar = function(star) {
			return star.id === $scope.stars[$scope.stars.length-1].id;
		};
		// function to get value for ranking stars
		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
		};
		$scope.setImage = function(imageUrl) {
	      		$scope.mainImageUrl = imageUrl;
	    	};
		// function to check authentification
		$scope.hasAuthorization = function(video) {
		if (!video || !video.user) return false;
			return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
		};
		
		$scope.getGenres = function() {
			return $scope.dropDownToList($scope.inputGenres);
		};

		$scope.getNationalities = function() {
			return $scope.dropDownToList($scope.inputNationalities);
		};

		$scope.dropDownToList = function(input){
			var list = [];
			for (var i in input)
			{
				if (input[i].ticked === true)
					list.push(input[i].name);
			}
			return list;
		};

		$scope.getStars = function(){
			var stars = [];
			for (var i in $scope.stars)
			{
				stars.push($scope.stars[i].name);
			}
			return stars;
		};

		// fuction to create new video (validation form)
		$scope.create = function(isValid) {
			if (isValid) {
				//temp variables to get multi select values
				
				
				// Create new video with model for mongo
				var video = new Videos({
					title: this.title,
					nationality: $scope.getNationalities(),
					description: this.description,
					releaseDate: this.releaseDate,
					stars: $scope.getStars(),
					genres: $scope.getGenres(),
					rate: $scope.rate,
					director: this.director,
					// TODO : change this to dynamic (just for test)
					path : ''
				});
				// send video to api
				video.$save(function(response) {
				  $location.path('videos/' + response._id);
				});
				// reset fields
				this.title = '';
				this.nationality = [];
				this.description = '';
				this.stars = [];
				this.genres = [];
				this.images = [];
				this.director = '';
				this.path = '';
			} else {
				$scope.submitted = true;
			}
		};

		$scope.remove = function(video) {
			if (video) {
				video.$remove();

				for (var i in $scope.videos) {
					if ($scope.videos[i] === video) {
						$scope.videos.splice(i, 1);
					}
				}
			} else {
				$scope.video.$remove(function(response) {
			 		$location.path('videos');
				});
			}
		};

		$scope.update = function(isValid) {
			if (isValid) {
				var video = $scope.video;
				video.nationality = $scope.getNationalities();
				video.stars = $scope.getStars();
				video.genres = $scope.getGenres();
				video.rate = $scope.rate;
				if (!video.updated) {
			  		video.updated = [];
				}
				video.updated.push(new Date().getTime());
				video.$update(function() {
			  		$location.path('videos/' + video._id);
				});
			} else {
				$scope.submitted = true;
			}
		};

		$scope.find = function() {
			Videos.query(function(videos) {
				$scope.videos = videos;
			});
		};

		$scope.findOne = function() {
			Videos.get({
				videoId: $stateParams.videoId
				}, function(video) {
					$scope.video = video;
					$scope.rate = video.rate;
					// Load stars for dynamic fields
					for (var i in video.stars)
					{
						if(i>0)
							$scope.stars.push({id: '', name:''});
						$scope.stars[i].name = video.stars[i];
						$scope.stars[i].id = i;
					}
					// load dropdown multi select values
					var item = 0;
					for (i in $scope.inputGenres)
					{
						if ($scope.inputGenres[i].name === video.genres[item])
						{
							$scope.inputGenres[i].ticked = true;
							item+=1;
						}

					}
					item = 0;
					for (i in $scope.inputNationalities)
					{
						if ($scope.inputNationalities[i].name === video.nationality[item])
						{
							$scope.inputNationalities[i].ticked = true;
							item+=1;
						}

					}
			});
		};
	}
]);

