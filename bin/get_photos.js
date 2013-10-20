var Flickr = require('flickr').Flickr;
var FlickrConfig = require('../config/flickr_keys').config;
var client = new Flickr(FlickrConfig.key, FlickrConfig.secret, {});
console.log(client);
