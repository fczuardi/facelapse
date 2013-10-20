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
var PICTURES_PER_PAGE = 100,
    FLICKR_USER_ID = '37959695@N06',
    DATA_FOLDER = '../data/metadata/';

//variables
var page = 1;

//helpers
var api = flickr(
    FlickrConfig.key,
    FlickrConfig.secret
);


var writeJSON = function (content, filename) {
    var filepath = path.join(path.dirname(__filename), DATA_FOLDER, filename);
    fs.exists(filepath, function(exists) {
        if (exists) {
            console.log('Already exists: ' + filepath);
        } else {
            fs.writeFile(filepath, JSON.stringify(content, null, '  '), function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('File '+filepath+' saved.');
                }
            });
        }
    });
};

function getPhotoData(page){
    api({
        method: 'flickr.people.getPublicPhotos',
        user_id: FLICKR_USER_ID,
        per_page: PICTURES_PER_PAGE,
        page: page,
        extras: 'license,url_o,url_z,url_c,date_taken,date_upload'
    }, function (err, response){
        var paddedPage = String('000' + page).slice(-3);
        if (err) {
            console.error('Could not load user photo data:', err);
        } else {
            console.log('page ' + page + ' loaded');
            if (response.stat === 'ok'){
                page += 1;
                if (page === response.photos.pages){
                    return;
                }
                writeJSON(response, 'data_page_'+paddedPage+'.json');
                getPhotoData(page);
            }
        }
    });
}

getPhotoData(page);

