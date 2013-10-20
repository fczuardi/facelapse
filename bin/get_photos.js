'use strict';

//libraries
var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    flickr = require('flickr-with-uploads');

//config
var FlickrConfig = require('../config/flickr_keys').config;

//constants
var PICTURES_FOLDER = '../data/pictures/',
    PICTURES_PER_PAGE = 10;

//vars
var downloading = {},
    page = 265;

//helpers
var allFinished = function () {
    for (var d  in downloading) {
        if (downloading[d] === true){
            return false;
        }
    }
    return true;
};

var download = function(url, filename){
    var request,
        file,
        filepath = path.join(path.dirname(__filename), PICTURES_FOLDER, filename);
    fs.exists(filepath, function(exists) {
        if (exists) {
            console.log('Already downloaded: ' + filepath);
            downloading[url] = false;
        } else {
            console.log('Downloading ' + filepath);
            file = fs.createWriteStream(filepath);
            request = http.get(url, function(response) {
                response.pipe(file);
                response.on('end', function(){
                    console.log('downloaded '+ url);
                    downloading[url] = false;
                    if (allFinished()){
                        console.log('allFinished');
                        page += 1;
                        startDownloadingPage(page);
                    }
                });
            });
        }
    });
};

var api = flickr(
    FlickrConfig.key, // consumer_key
    FlickrConfig.secret, // consumer_secret
    '', // oauth_token
    ''
); // oauth_token_secret

function startDownloadingPage(page){
    console.log('Starting page '+ page);
    api({
        method: 'flickr.people.getPublicPhotos',
        user_id: '37959695@N06',
        per_page: PICTURES_PER_PAGE,
        page: page,
        extras: 'license,url_o,url_z,url_c'
    }, function (err, response){
        var filename;
        if (err) {
            console.error('Could not load user id:', err);
        } else {
            // console.log(response.photos.photo);
            console.log(response.photos.photo.length);
            response.photos.photo.forEach(function (photo){
                filename = path.basename(url.parse(photo.url_c).path);
                download(photo.url_c, filename);
                downloading[photo.url_c] = true;
            });

        }
    });
}
startDownloadingPage(page);
//     );
// api({
//   method: 'flickr.people.getPublicPhotos',
//   user_id: 'governo_de_minas_gerais'

// }, function(err, response) {
//     'use strict';
//   if (err) {
//     console.error('Could not load photos:', err);
//   }
//   else {
//     console.log(response);
//   //   var new_photo_id = response.photoid._content;
//   //   // usually, the method name is precisely the name of the API method, as they are here:
//   //   api({method: 'flickr.photos.getInfo', photo_id: new_photo_id}, function(err, response) {
//   //     console.log('Full photo info:', response);
//   //     api({method: 'flickr.photosets.addPhoto', photoset_id: 1272356126, photo_id: new_photo_id}, function(err, response) {
//   //       console.log('Added photo to photoset:', response);
//   //     });
//   //   });
//   }
// });
