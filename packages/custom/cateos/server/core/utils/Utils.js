'use strict'

var fs = require('fs');
var crypto = require('crypto');
var Q = require("q");


exports.computeHashForFile = function(filepath) {
    var deferred = Q.defer();
    
    var fd = fs.createReadStream(filepath);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    
    fd.on('open', function () {
        console.log("Open");
        fd.pipe(hash);
    });

    fd.on('error', function(err) {
        console.log("Error : " + err);
        deferred.reject(err);
    });
    
    fd.on('end', function() {
        hash.end();
        deferred.resolve(hash.read());
    });
    
    return deferred.promise;
}