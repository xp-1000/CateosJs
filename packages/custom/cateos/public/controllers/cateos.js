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
		    'min-mode':'year'   
		};

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
		$scope.companies = [{id: 'company1', name:''}];

		// function to check authentification
		$scope.hasAuthorization = function(video) {
		if (!video || !video.user) return false;
			return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
		};
		// function to search field and filtering results and search only in some fields.
	    $scope.searchFilter = function (obj) {
	        var re = new RegExp($scope.searchText, 'i');
	        return !$scope.searchText || re.test(obj.details.title) || re.test(new Date(obj.details.releaseDate).getFullYear()) || re.test(obj.details.nationality)  || re.test(obj.details.genres)  || re.test(obj.details.companies) ;
	    };	

	    // function to filter date only if filled
	    $scope.dateFilter = function (obj) {
	    	if($scope.date) {
	    		if(new Date(obj.details.releaseDate).getFullYear() === new Date($scope.date).getFullYear()) {
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
			return $scope.dropdownFilter(obj.details.genres, item, $scope.inputGenres);
		};

		$scope.nationalitiesFilter = function(obj, item) {
			return $scope.dropdownFilter(obj.details.nationality, item, $scope.inputNationalities);
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
		// function for add another company button
		$scope.addCompany = function() {
			var item = $scope.companies.length+1;
			$scope.companies.push({'id':'company'+item, 'name':''});
		};
		// function for delete company button	
		$scope.removeCompany = function() {
			if($scope.companies.length > 1)
				$scope.companies.pop();
		};
		// return id for ng-show company button
		$scope.showCompany = function(company) {
			return company.id === $scope.companies[$scope.companies.length-1].id;
		};
		// function to get value for ranking companies
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
		// function to get companies 
		$scope.getCompanies = function(){
			var companies = [];
			for (var i in $scope.companies)
			{
				companies.push($scope.companies[i].name);
			}
			return companies;
		};

		$scope.loadTracks = function(tracks) {
			var res = [];
			for (var track in tracks) {
	        	var props = [];
        		for (var prop in tracks[track]) {
        			props.push(prop);
        		}
        		res.push(props);
        	}
        	return res;
		};

		$scope.loadDetails = function() {
			$scope.infos = [];
			$scope.infosAudio = [];
			$scope.infosVideo = [];
			for (var prop in $scope.video.infos) {
		      var value = $scope.video.infos[prop];
		      if($scope.video.infos.hasOwnProperty(prop)){
		        if(value) {
			        if(prop === 'audio_tracks') {
			        	$scope.infosAudio = $scope.loadTracks(value);
			        } else if(prop === 'video_tracks') {
			        	$scope.infosVideo = $scope.loadTracks(value);
			        } else {
			        	$scope.infos.push(prop);
			    	}
			    }
		      }
		   }
		};
		// fuction to create new video (validation form)
		$scope.create = function(isValid) {
			if (isValid) {
				//temp variables to get multi select values
				
				
				// Create new video with model for mongo
				var video = new Videos({
					// TODO : change this to dynamic (just for test)
					path : '/example/of/path',
					details : {
						title: this.title,
						nationality: $scope.getNationalities(),
						description: this.description,
						releaseDate: this.date,
						companies: $scope.getCompanies(),
						genres: $scope.getGenres(),
						rate: $scope.rate,
						link: this.link
					}
				});
				// send video to api
				video.$save(function(response) {
				  $location.path('videos/' + response._id);
				});
				// reset fields
				this.title = '';
				this.nationality = [];
				this.description = '';
				this.companies = [];
				this.genres = [];
				this.images = [];
				this.link = '';
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
				video.details.nationality = $scope.getNationalities();
				video.details.companies = $scope.getCompanies();
				video.details.genres = $scope.getGenres();
				video.details.rate = $scope.rate;
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
				for (var i in videos) {
					if (!videos[i].user) {
						videos[i].user={name:'Cateos'};
					}
				}
				$scope.videos = videos;
			});
		};

		$scope.findOne = function() {
			Videos.get({
				videoId: $stateParams.videoId
				}, function(video) {
					// set a fake system user if created by backend
					if (!video.user) {
						video.user={name:'Cateos'};
					}
					$scope.video = video;
					$scope.rate = video.details.rate;
					// Load companies for dynamic fields
					for (var i in video.details.companies)
					{
						if(i>0)
							$scope.companies.push({id: '', name:''});
						$scope.companies[i].name = video.details.companies[i];
						$scope.companies[i].id = i;
					}
					// load dropdown multi select values
					var item = 0;
					for (i in $scope.inputGenres)
					{
						if ($scope.inputGenres[i].name === video.details.genres[item])
						{
							$scope.inputGenres[i].ticked = true;
							item+=1;
						}

					}
					item = 0;
					for (i in $scope.inputNationalities)
					{
						if ($scope.inputNationalities[i].name === video.details.nationality[item])
						{
							$scope.inputNationalities[i].ticked = true;
							item+=1;
						}

					}
					$scope.loadDetails();
			});
		};
	}
]);

