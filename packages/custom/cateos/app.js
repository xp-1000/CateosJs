'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Cateos = new Module('cateos'),
    config = require('meanio').loadConfig(),
    express = require('express');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Cateos.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Cateos.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Cateos.menus.add({
    roles: ['authenticated'],
    title: 'Videos',
    link: 'all videos'
  });

  Cateos.menus.add({
    roles: ['authenticated'],
    title: 'Create new video',
    link: 'create video'
  });

  //app.use('/{{package}}/assets/img/', express.static(config.root + '/img'));

  //Cateos.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Cateos.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Cateos.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Cateos.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Articles.settings(function (err, settings) {
      //you now have the settings object
    });
    */
  Cateos.aggregateAsset('css', 'cateos.css');
  Cateos.aggregateAsset('css', 'bower_components/isteven-angular-multiselect/angular-multi-select.css',{
    absolute: true
  });
  Cateos.aggregateAsset('js', 'bower_components/isteven-angular-multiselect/angular-multi-select.js',{
    absolute: true
  });


  require('./server/core/synchro/synchro');


  return Cateos;
});
