'use strict';

angular.module('mean.cateos').controller('VideosController', ['$scope', '$stateParams', '$location', 'Global', 'Videos',
	function($scope, $stateParams, $location, Global, Videos) {
		$scope.global = Global;  
		// Global variables for views interaction
		// Mod view for list view (grid or list)
		$scope.layout = 'grid';
		// Inital ranking for create view
		$scope.rate = 5;
		// datePicker options to show only year with list view
		$scope.dateOptions = {
		    'year-format': '\'yyyy\'',
		    'datepicker-mode':'\'year\'',
		    'min-mode':'year'   
		};
		// Choice list for multi select fields
		$scope.inputGenres = [/*
			{name:'Action',        ticked: false},
			{name:'Romance',        ticked: false},
			{name:'Science Fiction',        ticked: false},
			{name:'Comedie',        ticked: false},
			{name:'Drame',        ticked: false}*/
		];  
		$scope.inputNationalities = [/*
			{name:'American',        ticked: false},
			{name:'English',        ticked: false},
			{name:'French',        ticked: false},
			{name:'German',        ticked: false},
			{name:'Spanish',        ticked: false}*/
		];  
		// Companies fields initialization for create view
		$scope.companies = [{id: 'company1', name:''}];

		// function to check authentification
		$scope.hasAuthorization = function(video) {
		if (!video || !video.user) return false;
			return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
		};
		// function to search field only for some values
	    $scope.searchFilter = function (obj) {
	        var re = new RegExp($scope.searchText, 'i');
	        return !$scope.searchText || re.test(obj.details.title) || re.test(new Date(obj.details.releaseDate).getFullYear()) || re.test(obj.details.nationality)  || re.test(obj.details.genres)  || re.test(obj.details.companies) ;
	    };	
	    // function to filter date only if filled
	    $scope.dateFilter = function (obj) {
    		// if filled field
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
		// function to filter on genres
		$scope.genresFilter = function(obj, item) {
			return dropdownFilter(obj.details.genres, item, $scope.inputGenres);
		};
		// function to filter on nationalities
		$scope.nationalitiesFilter = function(obj, item) {
			return dropdownFilter(obj.details.nationality, item, $scope.inputNationalities);
		};
		// function for date picker management
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
		// function to get value for ranking 
		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
		};
		/*
		// function to create new video (validation form)
		$scope.create = function(isValid) {
			if (isValid) {				
				// Create new video with model for mongo
				var video = new Videos({
					// TODO : change this to dynamic (just for test)
					path : '/example/of/path',
					details : {	
						title: this.title,
						nationality: getNationalities(),
						description: this.description,
						releaseDate: this.date,
						companies: getCompanies(),
						genres: getGenres(),
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
				this.rate = 5;
				this.path = '';
			} else {
				$scope.submitted = true;
			}
		};
		*/
		// REST API interaction to remove video from database
		$scope.remove = function(video) {
			if (video) {
				video.$remove();

				// remove from current videos list (for refresh list view)
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
		// REST API interecation to modify a video for edit view
		$scope.update = function(isValid) {
			if (isValid) {
				var video = $scope.video;
				video.details.nationality = getNationalities();
				video.details.companies = getCompanies();
				video.details.genres = getGenres();
				video.details.rate = $scope.rate;
				if (!video.updated) {
			  		video.updated = [];
				}
				video.updated.push(new Date().getTime());
				if (video.user.name === 'Cateos') {
					delete video.user;
				}
				video.$update(function() {
			  		$location.path('videos/' + video._id);
				});
			} else {
				$scope.submitted = true;
			}
		};
		// REST API interaction to get all videos for list view
		$scope.find = function() {
			// Get all videos
			Videos.query(function(videos) {
				// For each video
				for (var i=0; i<videos.length; i+=1) {
					// Load all existing nationalities from videos list to input field
					var nationalities = videos[i].details.nationality;
					for (var j=0; j<nationalities.length; j+=1) {
						if (!multiContains($scope.inputNationalities, nationalities[j])) {
							// If never meet this, add it to field
							$scope.inputNationalities.push({name:nationalities[j], ticked: false});
						}
					}
					// Load all existing genres from videos list to input field
					var genres = videos[i].details.genres;
					for (j=0; j<genres.length; j+=1) {
						if (!multiContains($scope.inputGenres, genres[j])) {
							// If never meet this, add it to field
							$scope.inputGenres.push({name:genres[j], ticked: false});
						}
					}
					// If no created by real user, the author is system
					if (!videos[i].user) {
						videos[i].user={name:'Cateos'};
					}
				}
				$scope.videos = videos;
			});
		};
		// REST API interaction to get one specific video for view view
		$scope.findOne = function() {
			// load videos list to populate input field
			$scope.find();
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
					// Load infos for second tab
					loadInfos();
			});
		};
		// function to filter dropdown multi select only if ticked
	    var dropdownFilter = function(obj, item, dropdownList) {
			if(isTicked(dropdownList))
			{
				var ticked = dropDownToList(dropdownList);
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
		// function to know if dropdown multi select is ticked
		var isTicked = function(dropdownList) {
			for (var i in dropdownList) {
				if (dropdownList[i].ticked === true) {
					return true;
				}
			}
			return false;

		};
		// function to get values from genres dropdown multi select
		var getGenres = function() {
			return dropDownToList($scope.inputGenres);
		};
		// function to get values from nationalities dropdown multi select
		var getNationalities = function() {
			return dropDownToList($scope.inputNationalities);
		};
		// function to get values from dropdown multi select
		var dropDownToList = function(input){
			var list = [];
			for (var i in input)
			{
				if (input[i].ticked === true)
					list.push(input[i].name);
			}
			return list;
		};
		// function to get companies values
		var getCompanies = function(){
			var companies = [];
			for (var i in $scope.companies)
			{
				companies.push($scope.companies[i].name);
			}
			return companies;
		};

		var loadTracks = function(tracks) {
			var res = [];
			// browse each track
			for (var track in tracks) {
	        	var props = [];
        		for (var prop in tracks[track]) {
        			if ((prop !== 'type') && (prop !== 'id')) {
        				// add element to current track list except for type and id
        				props.push(prop);
        			}
        		}
        		// add current track list to traks list
        		res.push(props);
        	}
        	// Return the tracks list which contains for each track all elements
        	return res;
		};

		// Browse infos and get all prop and its value
		var loadInfos = function() {
			// basic (first level) informations
			$scope.infos = [];
			// list of each track with its infos
			$scope.infosTracks = [];
			// browse each first level element
			for (var prop in $scope.video.infos) {
		      var value = $scope.video.infos[prop];
		      if($scope.video.infos.hasOwnProperty(prop)){
		        if(value) {
		        	// if it is the tracks list
			        if(prop === 'tracks') {
			        	// Get infos for each track in list
			        	$scope.infosTracks = loadTracks(value);
			        } else {
			        	// Add each other element to basic infos
			        	$scope.infos.push(prop);
			    	}
			    }
		      }
		   }
		};
		// util function to know if an array contains a specific element
		var multiContains = function(array, pattern) {
			for (var i in array) {
				if (array[i].name === pattern ) {
					return true;
				}
			}
			return false;
		};
	}
]);

