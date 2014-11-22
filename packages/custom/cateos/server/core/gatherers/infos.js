'use strict';

// Module dependencies
var Q = require('q');

// startpoint to get infos from file (currently only mediainfo support)
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