'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  stars: [String],
  genres: [String],
  images: [String],
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    trim: true
  },
  nationality: [String],
  description: {
    type: String,
    required: true,
    trim: true
  },
  director: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Configuration Schema
 */
var ConfigSchema = new Schema({
  synchro : {
    type : {
      type: String,
      required: true,
      trim: true
    },
    interval : {
      type: String,
      required: true,
      trim: true
    },
    folders : [String],
    checkAtStart : {
      type: Boolean 
    }
  }
});

/**
 * Validations
 */
VideoSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

/**
 * Statics
 */
VideoSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Video', VideoSchema);
mongoose.model('Config', ConfigSchema);
