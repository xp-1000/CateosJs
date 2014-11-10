'use strict';

var Q = require('q');

exports.getInfos = function(video) {
	var mimovie = require('mimovie');
	var deferred = Q.defer();
	mimovie(video, function(err, res) {
	  	if(err) deferred.reject(err);
		else {
		    deferred.resolve(res);
		}
	});
	return deferred.promise;
};