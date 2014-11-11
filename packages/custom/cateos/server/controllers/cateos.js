'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Video = mongoose.model('Video'),
  _ = require('lodash');


var fromTheMovieDb = function (obj) {
  // TODO translate from themoviedb.com
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

  var video = new Video({
    path : obj.infos.path,
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

/**
 * Find video by id
 */
exports.video = function(req, res, next, id) {
  Video.load(id, function(err, video) {
    if (err) return next(err);
    if (!video) return next(new Error('Failed to load video ' + id + ' : ' + err));
    req.video = video;
    next();
  });
};

/**
 * Create an video
 */
exports.create = function(req, res) {
  var video = new Video(req.body);
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

/**
 * Import an video from different api models
 */
exports.import = function(type, obj) {
  if(type === 'themoviedb') {
    fromTheMovieDb(obj);
  }
  //TODO : add system user
  /*video.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot save the video : ' + err
      });
    }
    res.json(video);

  });*/
};



/**
 * Update an video
 */
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

/**
 * Delete an video
 */
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

/**
 * Show an video
 */
exports.show = function(req, res) {
  res.json(req.video);
};

/**
 * List of videos
 */
exports.all = function(req, res) {
  Video.find().sort('-created').populate('user', 'name username').exec(function(err, videos) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the videos : ' + err
      });
    }
    res.json(videos);
  });
};
