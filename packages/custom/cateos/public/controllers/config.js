'use strict';

angular.module('mean.cateos').controller('ConfigController', ['$scope', '$stateParams', '$location', 'Global', 'Config',
	function($scope, $stateParams, $location, Global, Config) {
		$scope.global = Global;  

		$scope.directories = [{id: 'directory1', name:''}];

		// function for add another directory button
		$scope.addDirectory = function() {
			var item = $scope.directories.length+1;
			$scope.directories.push({'id':'directory'+item, 'name':'', 'path':''});
		};
		// function for delete directory button	
		$scope.removeDirectory = function() {
			if($scope.directories.length > 1)
				$scope.directories.pop();
		};
		// return id for ng-show directory button
		$scope.showDirectory = function(directory) {
			return directory.id === $scope.directories[$scope.directories.length-1].id;
		};

		// function to get directories 
		$scope.getDirectories = function(){
			var directories = [];
			for (var i in $scope.directories)
			{
				directories.push({name:$scope.directories[i].name,path:$scope.directories[i].path});
			}
			return directories;
		};

		// function to check authentification
		$scope.hasAuthorization = function(config) {
		if (!config) return false;
			return $scope.global.isAdmin;
		};


		$scope.update = function(isValid) {
			if (isValid) {
				$scope.config.synchro.db = $scope.getDirectories();
				$scope.config.$update(function() {
			  		$location.path('config/');
				});
			} else {
				$scope.submitted = true;
			}
		};

		$scope.find = function() {
			Config.query(function(configs) {
				var config = configs[0];
				for (var i in config.synchro.db)
					{
						if(i>0)
							$scope.directories.push({id: '', name:'', path:''});
						$scope.directories[i].name = config.synchro.db[i].name;
						$scope.directories[i].path = config.synchro.db[i].path;
						$scope.directories[i].id = i;
					}
				$scope.config = config;
			});
		};
	}
]);

