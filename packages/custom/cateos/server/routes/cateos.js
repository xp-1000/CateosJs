'use strict';

// Module dependencies
var videos = require('../controllers/cateos');
var config = require('../controllers/config');

// Start core initialization with loading configuration
config.init();


// Authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.video.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

// API routes for front end communication
module.exports = function(Videos, app, auth) {

  app.route('/videos')
    .get(videos.all)
    .post(auth.requiresLogin, videos.create);
  app.route('/videos/:videoId')
    .get(videos.show)
    .put(auth.requiresLogin, hasAuthorization, videos.update)
    .delete(auth.requiresLogin, hasAuthorization, videos.destroy);
  app.route('/config')
    .get(config.show)
    .put(auth.requiresLogin, config.update);

  // Finish with setting up the videoId param
  app.param('videoId', videos.video);
};
