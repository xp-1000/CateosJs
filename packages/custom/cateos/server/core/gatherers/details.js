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
var themoviedb = function (infos) {
	// TODO do not hard code api token key
	var mdb = require('moviedb')('2384ed97dce589f4c05b7ed0ae0c6a71');
	var name = infos.path.substring(infos.path.lastIndexOf('/')+1, infos.path.lastIndexOf('.'));
	return search(name,mdb).then(info(mdb));
};

// startpoint (currentl only themoviedb api support)
exports.getDetails = function(infos,config) {
	if(config.name === 'themoviedb') {
		return themoviedb(infos,config);
	}

};
