'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Config = mongoose.model('Config');


/**
 * Load configuration for cateos
 */
exports.load = function(req, res) {
	
  	Config.find(null,function(err, config) {
  		if (err) { throw err; }
  		// console.log(config);
	    console.log(config);  
  	});
};

