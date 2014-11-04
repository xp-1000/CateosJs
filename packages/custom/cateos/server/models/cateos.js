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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  details : {
    title: {
      type: String,
      required: true,
      trim: true
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
    }
  },
  infos : { 
    video_tracks: [ { 
        width: { type: Number },
        height: { type: Number },
        codec: { type: String, trim: true },
        fps: { type: Number },
        bitrate: { type: Number },
        profile: { type: String, trim: true },
        aspect: { type: String, trim: true }
      } 
    ],
    audio_tracks: [ { 
        ch: { type: Number },
        ch_pos: { type: String, trim: true },
        sample_rate: { type: String, trim: true },
        codec: { type: String, trim: true },
        bitrate: { type: Number },
        bitrate_mode: { type: String, trim: true },
        lang: { type: String, trim: true } 
      }
    ],
    subtitles: [ String ],
    bitrate: { type: Number },
    path: { type: String, trim: true },
    size: { type: Number },
    duration: { type: Number },
    encoded: { type: Date },
    tagged: { type: Date },
    created: { type: Date },
    modified: { type: Date },
    menu: { type: Boolean } 
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
      trim: true
    },
    checkAtStart : {
      type: Boolean 
    },
    api : {
      name : { type: String, trim: true },
      key : {type: String, trim: true}
    },
    db : [ {
        name : { type: String, trim: true },
        path : { type: String, trim: true }
      }
    ]
  }
});

/**
 * Validations
 */
VideoSchema.path('details.title').validate(function(title) {
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
