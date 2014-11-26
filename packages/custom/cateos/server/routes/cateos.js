'use strict';

// Module dependencies
var VideoCtlr = require('../controllers/VideoController');
var ConfigurationCtlr = require('../controllers/ConfigurationController');

// Start core initialization with loading configuration
ConfigurationCtlr.init();


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
    .get(VideoCtlr.all)
    .post(auth.requiresLogin, VideoCtlr.create);
  app.route('/videos/:videoId')
    .get(VideoCtlr.show)
    .put(auth.requiresLogin, hasAuthorization, VideoCtlr.update)
    .delete(auth.requiresLogin, hasAuthorization, VideoCtlr.destroy);
  app.route('/config')
    .get(ConfigurationCtlr.show)
    .put(auth.requiresLogin, ConfigurationCtlr.update);

  // Finish with setting up the videoId param
  app.param('videoId', VideoCtlr.video);
};
