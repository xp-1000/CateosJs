'use strict';
var Video = require('../controllers/cateos');
var listeners = [];

var loadInfos = function(filename) {
	var Infos = require('./gatherers/infos');
	return Infos.getInfos(filename);
};


var watch = function(config, path) {
	var INotifyWait = require('inotifywait');

	var listener = new INotifyWait(path, { recursive: true });
	listener.on('ready', function (filename) {
	  	console.log('Watcher added for : ' + path);
	});
	listener.on('close', function () {
	  	console.log('Watcher removed for : ' + path);
	});
	listener.on('add', function (filename) {
	  console.log(filename + ' added');
	  var video = {};
	  loadInfos(filename)	
	  	.then(function(infos) {
	  			video.infos = infos;
				var Details = require('./gatherers/details');
				return Details.getDetails(infos,config.synchro.api);
			})
	  	.then(function(details) {
	  			video.details = details;
	  			console.log(details);
				Video.import(config.synchro.api.name, video);
			});
	});
	return listener;

};


var browseConfig = function (config) {

	var reps = config.synchro.db;
	for (var i = 0; i<reps.length; i+=1) { 
		listeners.push(watch(config,reps[i].path));
	}
};

exports.run = function(config) {
	browseConfig(config);
};

exports.reload = function(config) {
	for (var i in listeners) { 
		listeners[i].close();
	}
	browseConfig(config);
};
