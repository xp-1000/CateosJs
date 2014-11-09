'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Config = mongoose.model('Config');



/**
 * Load configuration for cateos
 */
exports.load = function(callback) {
  	Config.find(null,function(err, config) {
  		if (err) { throw err; }
  		console.log('configuration loeaded');
  		callback(config[0]);
  	});
};

exports.create = function() {
  	var config = new Config({synchro:{type:'inotify'}});
  	config.save(function(err) {
    if (err) {
      	console.log(err);
    }
  });
};


