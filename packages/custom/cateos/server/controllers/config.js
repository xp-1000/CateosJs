'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Q = require('q'),
  Config = mongoose.model('Config'),
  Sync = require ('../core/sync');
  
var currentConf = {};
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

exports.init = function() {
    Config.find(null,function(err, config) {
      if (err) { console.log(err); }
      if (config[0]) {
        console.log('Configuration found, loading it');
        currentConf = config[0];
      }
      else {
        console.log('Configuration does not exist, creating it');
        var defaultConf = {synchro:{type:'inotify',api:{name:'themoviedb',key:'2384ed97dce589f4c05b7ed0ae0c6a71'},db:[{name:'tmp', path:'/tmp'}]}};
        exports.create(defaultConf);
        currentConf = defaultConf;
      }
      Sync.run(currentConf);
    });
};

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


exports.create = function(req) {
  	var config = new Config(req);
  	config.save(function(err) {
    if (err) {
      	console.log(err);
    }
  });
};

exports.update = function(req, res) {

  currentConf.synchro = req.body.synchro;
  Sync.reload(currentConf);
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

exports.show = function(req, res) {
  
  res.json([currentConf]);
};


