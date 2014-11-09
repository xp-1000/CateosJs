'use strict';

var Config = require('../controllers/config');
Config.load(function (config){
	var synchro = require ('./synchro');
	synchro.run(config);
	
});
