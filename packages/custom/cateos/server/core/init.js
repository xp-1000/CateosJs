'use strict';

var Config = require('../controllers/config');
/*
Config.load(function (config){
	var sync = require ('./sync');
	sync.run(config);
	
});*/

Config.load().then(function (config) {	
	var sync = require ('./sync');
	sync.run(config);
});


