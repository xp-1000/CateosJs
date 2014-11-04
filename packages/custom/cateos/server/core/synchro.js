'use strict';

exports.run = function(config) {
	var Inotify = require('inotify').Inotify;
	var inotify = new Inotify(); //persistent by default, new Inotify(false) //no persistent

	var data = {}; //used to correlate two events

	var callback = function(event) {
	    var mask = event.mask;
	    var type = mask && Inotify.IN_ISDIR ? 'directory ' : 'file ';

	    //the porpuse of this hell of 'if'
	    //statements is only illustrative.

	    if(mask && Inotify.IN_CREATE) {
	        console.log(type + ' ' + event.name + ' created');
	    } else if(mask && Inotify.IN_DELETE) {
	        console.log(type + 'deleted');
	    } else if(mask && Inotify.IN_MOVED_FROM) {
	        data = event;
	        data.type = type;
	    } else if(mask && Inotify.IN_MOVED_TO) {
	        if( Object.keys(data).length &&
	            data.cookie === event.cookie) {
	            console.log(type + ' moved to ' + data.type);
	            data = {};
	        }
	    }
	};

	var reps = config.synchro.db;
	for (var i = 0; i<reps.length; i+=1) {
		var listener = { 
			path:      reps[i].path, 
	     	watch_for: Inotify.IN_CREATE || Inotify.IN_MOVED_TO || Inotify.IN_MOVED_FROM || Inotify.IN_DELETE,
	     	callback:  callback
	  	};
		inotify.addWatch(listener);
		console.log(reps[i].name + ' added to sync');
	}
};