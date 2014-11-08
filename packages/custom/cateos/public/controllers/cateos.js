'use strict';

angular.module('mean.cateos').controller('VideosController', ['$scope', '$stateParams', '$location', 'Global', 'Videos',
	function($scope, $stateParams, $location, Global, Videos) {
		$scope.global = Global;  
		$scope.layout = 'grid';
		$scope.rate = 5;
		// datePicker options to show only year with list view
		$scope.dateOptions = {
		    'year-format': '\'yyyy\'',
		    'datepicker-mode':'\'year\'',
		    'min-mode':'year'   };

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
			{name:'American',        ticked: false},
			{name:'English',        ticked: false},
			{name:'French',        ticked: false},
			{name:'German',        ticked: false},
			{name:'Spanish',        ticked: false}
		];  
		$scope.stars = [{id: 'star1', name:''}];

		// function to check authentification
		$scope.hasAuthorization = function(video) {
		if (!video || !video.user) return false;
			return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
		};
		// function to search field and filtering results and search only in some fields.
	    $scope.searchFilter = function (obj) {
	        var re = new RegExp($scope.searchText, 'i');
	        return !$scope.searchText || re.test(obj.title) || re.test(new Date(obj.releaseDate).getFullYear()) || re.test(obj.nationality)  || re.test(obj.genres)  || re.test(obj.stars) || re.test(obj.stars) || re.test(obj.director) ;
	    };	

	    // function to filter date only if filled
	    $scope.dateFilter = function (obj) {
	    	if($scope.date) {
	    		if(new Date(obj.releaseDate).getFullYear() === new Date($scope.date).getFullYear()) {
	    			return true;
	    		}
		    	else {
		    		return false;
		    	}
	    	} else {
	    		return true;
	    	}
	    };	
	    // functio to filter dropdown multi select only if ticked
	    $scope.dropdownFilter = function(obj, item, dropdownList) {
			if($scope.isTicked(dropdownList))
			{
				var ticked = $scope.dropDownToList(dropdownList);
				for (var i in ticked) {
					if (obj.indexOf(ticked[i]) !== -1) {
						return true;
					}
				}
				return false;
			} else {
				return true;
			}
		};

		$scope.genresFilter = function(obj, item) {
			return $scope.dropdownFilter(obj.genres, item, $scope.inputGenres);
		};

		$scope.nationalitiesFilter = function(obj, item) {
			return $scope.dropdownFilter(obj.nationality, item, $scope.inputNationalities);
		};
		// function to know if dropdown multi select is ticked
		$scope.isTicked = function(dropdownList) {
			for (var i in dropdownList) {
				if (dropdownList[i].ticked === true) {
					return true;
				}
			}
			return false;

		};

		// function for date picker
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
		// function for delete star button	
		$scope.removeStar = function() {
			if($scope.stars.length > 1)
				$scope.stars.pop();
		};
		// return id for ng-show star button
		$scope.showStar = function(star) {
			return star.id === $scope.stars[$scope.stars.length-1].id;
		};
		// function to get value for ranking stars
		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
		};
		// function to get values from genres dropdown multi select
		$scope.getGenres = function() {
			return $scope.dropDownToList($scope.inputGenres);
		};
		// function to get nationalities from genres dropdown multi select
		$scope.getNationalities = function() {
			return $scope.dropDownToList($scope.inputNationalities);
		};
		// function to get values from dropdown multi select
		$scope.dropDownToList = function(input){
			var list = [];
			for (var i in input)
			{
				if (input[i].ticked === true)
					list.push(input[i].name);
			}
			return list;
		};
		// function to get stars 
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
					releaseDate: this.date,
					stars: $scope.getStars(),
					genres: $scope.getGenres(),
					rate: $scope.rate,
					director: this.director,
					// TODO : change this to dynamic (just for test)
					path : '/example/of/path'
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
				this.rat = 5;
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

