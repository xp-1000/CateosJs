'use strict';

// Module dependencies

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Video schema

var VideoSchema = new Schema({
  // video creation date on cateos
  created: {
    type: Date,
    default: Date.now
  },
  // video owner, none if added by system
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  // path to file access on disk
  path: {
    type: String,
    required: true,
    trim: true
  },
  // sub object which contains all video details
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
    companies: [String],
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
    // ref link to video (currently imdb)
    link: {
      type: String,
      required: true,
      trim: true
    }
  },
  // sub object which contains all file infos (mediainfo)
  infos : { 
    tracks: [ { 
        type: { type: String, trim: true },
        id: { type: String, trim: true },
        format_info: { type: String, trim: true },
        format_profile: { type: String, trim: true },
        codec_id_info: { type: String, trim: true },
        duration: { type: String, trim: true },
        bit_rate_mode: { type: String, trim: true },
        bit_rate: { type: String, trim: true },
        maximum_bit_rate: { type: String, trim: true },
        width: { type: String, trim: true },
        height: { type: String, trim: true },
        display_aspect_ratio: { type: String, trim: true },
        frame_rate_mode: { type: String, trim: true },
        frame_rate: { type: String, trim: true },
        color_space: { type: String, trim: true },
        chroma_subsampling: { type: String, trim: true },
        channel_s_: { type: String, trim: true },
        sampling_rate: { type: String, trim: true },
        bit_depth: { type: String, trim: true },
        compression_mode: { type: String, trim: true },
        stream_size: { type: String, trim: true },
        writing_library: { type: String, trim: true },
        language: { type: String, trim: true },
        encoded_date: { type: Date },
      } 
    ],
    format: { type: String, trim: true },
    codec_id: { type: String, trim: true },
    file_size: { type: String, trim: true },
    duration: { type: String, trim: true },
    overall_bit_rate: { type: String, trim: true },
    writing_application: { type: String, trim: true },
    tagged_date: { type: Date },
    encoded_date: { type: Date }
  }
  // sub object which contains all file infos (mimovie)
  /*infos : { 
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
  }*/
});

// Configuration Schema

var ConfigSchema = new Schema({
  // synchronization configuration
  synchro : {
    // currently, only inotify
    type : {
      type: String,
      required: true,
      trim: true
    },
    // currently, only themoviedb
    api : {
      name : { type: String, trim: true },
      key : {type: String, trim: true}
    },
    // directries list to watch
    db : [ {
        name : { type: String, trim: true },
        path : { type: String, trim: true }
      }
    ]
  }
});

// Validations

VideoSchema.path('details.title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

VideoSchema.path('details.description').validate(function(description) {
  return !!description;
}, 'Description cannot be blank');

VideoSchema.path('details.images').validate(function(images) {
  return !!images.length;
}, 'At least one image is mandatory');

ConfigSchema.path('synchro.api.name').validate(function(name) {
  return !!name;
}, 'Api name cannot be blank');

ConfigSchema.path('synchro.api.key').validate(function(key) {
  return !!key;
}, 'Api key cannot be blank');

ConfigSchema.path('synchro.type').validate(function(type) {
  return !!type;
}, 'Type cannot be blank');

// Statics

VideoSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

// Models exportation (to use in controller)

mongoose.model('Video', VideoSchema);
mongoose.model('Config', ConfigSchema);
