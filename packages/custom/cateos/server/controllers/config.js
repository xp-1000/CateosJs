'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Q = require('q'),
  Config = mongoose.model('Config');

/**
 * Load configuration for cateos
 */
/*exports.load = function(callback) {
  	Config.find(null,function(err, config) {
  		if (err) { throw err; }
      if (config[0]) {
        console.log('Configuration found, loading it');
        console.log(config);
  		  callback(config[0]);
      }
      else {
        console.log('Configuration does not exist, creating it');
        exports.create();
      }
  	});
};*/

exports.load = function() {
    var deferred = Q.defer();
    Config.find(null,function(err, config) {
      if (err) { deferred.reject(err); }
      if (config[0]) {
        console.log('Configuration found, loading it');
        deferred.resolve(config[0]);
      }
      else {
        console.log('Configuration does not exist, creating it');
        var defaultConf = {synchro:{type:'inotify',api:{name:'themoviedb',key:'2384ed97dce589f4c05b7ed0ae0c6a71'},db:[{name:'tmp', path:'/tmp'}]}};
        exports.create(defaultConf);
      }
    });
    return deferred.promise;
};


exports.create = function(req) {
  	var config = new Config(req);
  	config.save(function(err) {
    if (err) {
      	console.log(err);
    }
  });
};


