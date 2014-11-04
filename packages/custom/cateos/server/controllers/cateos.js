'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Video = mongoose.model('Video'),
  _ = require('lodash');


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
 * Update an video
 */
exports.update = function(req, res) {
  var video = req.video;

  video = _.extend(video, req.body);

  video.save(function(err) {
    if (err) {
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
    console.log(videos);
  });
};
