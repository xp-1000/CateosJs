'use strict';

// Module dependencies
var VideoCtlr = require('../controllers/VideoController');
// global context for listerners interaction
var listeners = [];

// startpoint for gatherers enabling
var loadInfos = function(filename) {
	var Infos = require('./gatherers/infos');
	return Infos.getInfos(filename);
};


var watch = function(config, path) {
	var INotifyWait = require('inotifywait');
	// Enable listener for current directory
	var listener = new INotifyWait(path, { recursive: true });
	listener.on('ready', function (filename) {
	  	console.log('Watcher added for : ' + path);
	});
	listener.on('close', function () {
	  	console.log('Watcher removed for : ' + path);
	});
	// Adding new file to database
	listener.on('add', function (filename) {
	  console.log(filename + ' added');
	  var video = {};
	  // get infos part for new video
	  loadInfos(filename)	
	  	.then(function(infos) {
	  			video.infos = infos;
	  			console.log('!!!! '+ infos.complete_name);
	  			video.path = infos.complete_name;
	  			console.log(infos);
				var Details = require('./gatherers/details');
				return Details.getDetails(infos,config.synchro.api);
			})
	  	// get details part for new video
	  	.then(function(details) {
	  			video.details = details;
				VideoCtlr.import(config.synchro.api.name, video);
			});
	});
	return listener;

};

// run one listener for each configured directories
var browseConfig = function (config) {
	var reps = config.synchro.db;
	for (var i = 0; i<reps.length; i+=1) { 
		listeners.push(watch(config,reps[i].path));
	}
};

// Startpoint to run listeners
exports.run = function(config) {
	browseConfig(config);
};

// Restart listerners with new configuration
exports.reload = function(config) {
	// stop all listeners
	for (var i in listeners) { 
		listeners[i].close();
	}
	// run listeners again
	browseConfig(config);
};
