'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Video = mongoose.model('Video');

/**
 * Globals
 */
var user;
var video;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Video:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        video = new Video({
          title: 'Video Title',
          content: 'Video Content',
          user: user
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return video.save(function(err) {
          should.not.exist(err);
          video.title.should.equal('Video Title');
          video.content.should.equal('Video Content');
          video.user.should.not.have.length(0);
          video.created.should.not.have.length(0);
          done();
        });
      });

      it('should be able to show an error when try to save without title', function(done) {
        video.title = '';

        return video.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without content', function(done) {
        video.content = '';

        return video.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        video.user = {};

        return video.save(function(err) {
          should.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      video.remove();
      user.remove();
      done();
    });
  });
});
