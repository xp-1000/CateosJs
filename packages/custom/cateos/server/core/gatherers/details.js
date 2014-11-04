'use strict';

var Q = require('q');


var info = function(mdb) {
	return function(res){
		var deferred = Q.defer();
		mdb.movieInfo({id: res.results[0].id}, deferred.makeNodeResolver());
		return deferred.promise;
    };
};

var search = function(name,mdb) {
	var deferred = Q.defer();
	mdb.searchMovie({query: name }, deferred.makeNodeResolver());
	return deferred.promise;
};

var themoviedb = function (infos) {
	// TODO do not hard code api token key
	var mdb = require('moviedb')('2384ed97dce589f4c05b7ed0ae0c6a71');
	var name = infos.path.substring(infos.path.lastIndexOf('/')+1, infos.path.lastIndexOf('.'));
	return search(name,mdb).then(info(mdb));
};

exports.getDetails = function(infos,config) {
	if(config.name === 'themoviedb') {
		return themoviedb(infos,config);
	}

};
