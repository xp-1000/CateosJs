'use strict';

// Module dependencies.

var mongoose = require('mongoose'),
  VideoModel = mongoose.model('Video'),
  _ = require('lodash'),
  Utils = require('../core/utils/Utils'),
  Q = require('q');

mongoose.set('debug', true);

function checkIfVideoAlreadyExists(filepath) {
  return function(filehash) {
    var deferred = Q.defer();
    VideoModel.findOne({path:filepath, hash:filehash}, function (err, result) {
      if (err) {
        deferred.reject(err);
      }
      if (!result) deferred.resolve(filehash);
      else deferred.reject('This video already exists');
    });
    return deferred.promise;
  };
}

function storeVideoInformation(obj) {
  return function(hash) {
    var genres = [];
    for (var i in obj.details.genres) {
      genres.push(obj.details.genres[i].name);
    }
    var nationality = [];
    for (i in obj.details.production_countries) {
      nationality.push(obj.details.production_countries[i].name);
    }
    var companies = [];
    for (i in obj.details.production_companies) {
      companies.push(obj.details.production_companies[i].name);
    }
    
    var video = new VideoModel({
      path : obj.path,
      hash: hash,
      details : {
        title : obj.details.title,
        description : obj.details.overview,
        rate : obj.details.vote_average,
        link : 'http://www.imdb.com/title/' + obj.details.imdb_id,
        companies : companies,
        genres : genres,
        nationality : nationality,
        images : [ 'http://image.tmdb.org/t/p/w300' + obj.details.poster_path ],
        releaseDate : new Date(obj.details.release_date)
      },  
      infos : obj.infos
    });
    video.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  };
}

// dedicated translation function for themoviedb video details
var fromTheMovieDb = function (obj) {
  Utils.computeHashForFile(obj.path)
    .then(checkIfVideoAlreadyExists(obj.path))
    .then(storeVideoInformation(obj));
};

// Import an video from different api models

exports.import = function(type, obj) {
  switch(type) {
    case 'themoviedb' :
      fromTheMovieDb(obj);
      break;
    default:
      fromTheMovieDb(obj);
  }
};

// Find video by id

exports.video = function(req, res, next, id) {
  VideoModel.load(id, function(err, video) {
    if (err) return next(err);
    if (!video) return next(new Error('Failed to load video ' + id + ' : ' + err));
    req.video = video;
    next();
  });
};

// Create an video

exports.create = function(req, res) {
  var video = new VideoModel(req.body);
  video.user = req.user;
  video.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot save the video : ' + err
      });
    }
    res.json(video);

  });
};


// Update an video

exports.update = function(req, res) {
  var video = req.video;
  video = _.extend(video, req.body);
  video.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot update the video : ' + err
      });
    }
    res.json(video);

  });
};

// Delete an video

exports.destroy = function(req, res) {
  var video = req.video;

  video.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the video : ' + err
      });
    }
    res.json(video);

  });
};

exports.destroyVideoWithPath = function(filepath) {
  VideoModel.findOneAndRemove({path:filepath}, function(err) {
    if (err) {
      console.log('Can\'t remove the video ' + filepath + '. ' + err);
    } else {
      console.log('Video ' + filepath + ' removed from database');
    }
  });
};

// Show an video

exports.show = function(req, res) {
  res.json(req.video);
};

// List of videos

exports.all = function(req, res) {
  VideoModel.find().sort('-created').populate('user', 'name username').exec(function(err, videos) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the videos : ' + err
      });
    }
    res.json(videos);
  });
};
