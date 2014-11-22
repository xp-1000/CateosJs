'use strict';

// Module dependencies

var mongoose = require('mongoose'),
  Q = require('q'),
  Config = mongoose.model('Config'),
  Sync = require ('../core/sync');
  
var currentConf = {};

// Configuration initialization called directly when cateos run
exports.init = function() {
    Config.find(null,function(err, config) {
      if (err) { console.log(err); }
      // if config already exists, load it
      if (config[0]) {
        console.log('Configuration found, loading it');
        currentConf = config[0];
      }
      // if no configuration found, create default configuration
      else {
        console.log('Configuration does not exist, creating it');
        currentConf = {synchro:{type:'inotify',api:{name:'themoviedb',key:'2384ed97dce589f4c05b7ed0ae0c6a71'},db:[{name:'tmp', path:'/tmp'}]}};
        // save in database
        exports.create(currentConf);
      }
      // Run synchronization process with current configuration
      Sync.run(currentConf);
    });
};

// Get configuration from db with promise (currently unnused)
exports.load = function() {
    var deferred = Q.defer();
    Config.find(null,function(err, config) {
      if (err) { deferred.reject(err); }
      if (config[0]) {
        deferred.resolve(config[0]);
      }
    });
    return deferred.promise;
};

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

// Create configuration in database
exports.create = function(req) {
  	var config = new Config(req);
  	config.save(function(err) {
    if (err) {
      	console.log(err);
    }
  });
};

// Updating configuration in database
exports.update = function(req, res) {
  // update current configuration by the new one
  currentConf.synchro = req.body.synchro;
  // realoading synchonization process with new confguration
  Sync.reload(currentConf);
  // save new configuration in database
  currentConf.save (function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot update the config : ' + err
      });
    }
    res.json(currentConf);

  });
};

// Show configuration for front end
exports.show = function(req, res) {
  res.json([currentConf]);
};


