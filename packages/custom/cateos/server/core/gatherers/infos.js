'use strict';

// Module dependencies
var Q = require('q');

// startpoint to get infos from file via mimovie
/* exports.getInfos = function(video) {
	var mimovie = require('mimovie');
	var deferred = Q.defer();
	mimovie(video, function(err, res) {
	  	if(err) deferred.reject(err);
		else {
		    deferred.resolve(res);
		}
	});
	return deferred.promise;
};*/

// startpoint to get infos from file via mediainfo
exports.getInfos = function(video) {
	var mediainfo = require('mediainfo');
	var deferred = Q.defer();
	mediainfo(video, function(err, res) {
	  	if(err) deferred.reject(err);
		else {
		    deferred.resolve(res[0]);
		}
	});
	return deferred.promise;
};