'use strict';

// Module dependencies
var Q = require('q');

// function to get detailled informations about movie (currently only themoviedb api support)
var info = function(mdb) {
	return function(res){
		var deferred = Q.defer();
		mdb.movieInfo({id: res.results[0].id}, deferred.makeNodeResolver());
		return deferred.promise;
    };
};

// video search function (currently only themoviedb api support)
var search = function(name,mdb) {
	var deferred = Q.defer();
	mdb.searchMovie({query: name }, deferred.makeNodeResolver());
	return deferred.promise;
};

// the moviedb dedicated init function
var themoviedb = function (infos,config) {
	var mdb = require('moviedb')(config.key);
	var name = '';
	if (infos.movie_name) {
		console.log('movie name by encoder');
		name = infos.movie_name;
	}
	else {
		console.log('name by path file');
		name = infos.complete_name.substring(infos.complete_name.lastIndexOf('/')+1, infos.complete_name.lastIndexOf('.'));
	}
	console.log(name);

	return search(name,mdb).then(info(mdb));
};

// startpoint (currentl only themoviedb api support)
exports.getDetails = function(infos,config) {
	if(config.name === 'themoviedb') {
		return themoviedb(infos,config);
	}

};
