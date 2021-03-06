//Requirejs config
requirejs.config({
    baseUrl: './js/lib/',
    paths: {
        'text': 'requirejs/text',
        'json': 'json/json'
    }
});

require(
    [
        'text'
    ],
    function (text) {
        'use strict';
        var listData,
            photoList,
            currentIndex = 0,
            photoCountStart = 0,
            firstJSON = '../data/metadata/data_page_001.json',
            // photoCountStart = 500,
            // firstJSON = '../data/metadata/data_page_006.json',
            newAttributes = [];
        text.get(firstJSON, function(data){
            listData = JSON.parse(data);
            photoList = listData.photos.photo;
            document.getElementById('current').setAttribute('src', photoList[currentIndex].url_c);
            document.getElementById('previous').setAttribute('src', '');
        });
        function getPreviousSelectedPhoto(){
            for (var i = currentIndex - 1; i >= 0; i--) {
                if (newAttributes[i].selected === 'true'){
                    return i;
                }
            }
            return currentIndex;
        }
        function getNextSelectedPhoto(){
            for (var i = currentIndex + 1; i < newAttributes.length; i++) {
                if (newAttributes[i].selected === 'true'){
                    return i;
                }
            }
            return currentIndex;
        }
        function getLocalPictureURL(url){
            return '../data/pictures/' + url.substring( url.lastIndexOf('/')+1, url.length );
        }
        function updatePhotoURLs(){
            var previousSelected = getPreviousSelectedPhoto();
            document.getElementById('current').setAttribute('src', getLocalPictureURL(photoList[currentIndex].url_c));
            if (photoList[previousSelected] !== undefined){
                document.getElementById('previous').setAttribute('src', getLocalPictureURL(photoList[previousSelected].url_c));
            } else{
                document.getElementById('previous').setAttribute('src', '');
            }
        }
        function updateAttributes(){
            if (newAttributes[currentIndex] === undefined){
                document.getElementById('current').dataset.selected = false;
                return false;
            }
            console.log('updateAttributes', newAttributes[currentIndex]);
            if (newAttributes[currentIndex] !== undefined){
                document.getElementById('current').style.width = newAttributes[currentIndex].width;
                document.getElementById('current').style.top = newAttributes[currentIndex].top;
                document.getElementById('current').style.left = newAttributes[currentIndex].left;
                document.getElementById('current').dataset.selected = (newAttributes[currentIndex].selected === 'true');
            }
            if (newAttributes[currentIndex - 1] !== undefined){
                document.getElementById('previous').style.width = newAttributes[currentIndex - 1].width;
                document.getElementById('previous').style.top = newAttributes[currentIndex - 1].top;
                document.getElementById('previous').style.left = newAttributes[currentIndex - 1].left;
            }
        }
        document.body.addEventListener('keypress', function(event){
            var currentImg = document.getElementById('current'),
                increment = 0,
                output;
            console.log('key pressed', event.keyCode, event.charCode);
            switch (event.keyCode){
                case 39:
                    //left
                    increment = event.shiftKey ? 10 : 1;
                    currentImg.style.left = (parseInt(currentImg.style.left, 10) + increment) + 'px';
                    break;
                case 37:
                    //right
                    increment = event.shiftKey ? -10 : -1;
                    currentImg.style.left = (parseInt(currentImg.style.left, 10) + increment) + 'px';
                    break;
                case 40:
                    //down
                    increment = event.shiftKey ? 10 : 1;
                    currentImg.style.top = (parseInt(currentImg.style.top, 10) + increment) + 'px';
                    break;
                case 38:
                    //up
                    increment = event.shiftKey ? -10 : -1;
                    currentImg.style.top = (parseInt(currentImg.style.top, 10) + increment) + 'px';
                    break;
                case 0:
                    switch (event.charCode){
                        case 115:
                            // s
                            currentImg.dataset.selected = (currentImg.dataset.selected === 'true') ? false : true;
                            break;
                        case 93:
                            // ]
                            increment = 10;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 91:
                            // [
                            increment = -10;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 61:
                            // +
                            increment = 40;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 45:
                            // -
                            increment = -40;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 46:
                            // .
                            currentIndex += 1;
                            updatePhotoURLs();
                            updateAttributes();
                            break;
                        case 44:
                            // ,
                            currentIndex -= 1;
                            updatePhotoURLs();
                            updateAttributes();
                            break;
                        case 62:
                            // >
                            currentIndex = getNextSelectedPhoto();
                            updatePhotoURLs();
                            updateAttributes();
                            break;
                        case 60:
                            // <
                            currentIndex = getPreviousSelectedPhoto();
                            updatePhotoURLs();
                            updateAttributes();
                            break;
                        case 99:
                            // c (for copy/paste)
                            return;
                            break;
                    }
            }
            newAttributes[currentIndex] = {
                'width': currentImg.style.width,
                'height': currentImg.clientHeight,
                'left': currentImg.style.left,
                'top': currentImg.style.top,
                'filename': currentImg.src,
                'selected': currentImg.dataset.selected
            };
            output = 'convert -size 1000x1000 xc:white data/moved/base.jpg\n';
            newAttributes.forEach(function(image, index){
                var w = parseInt(image.width, 10),
                    h = parseInt(image.height, 10),
                    l = parseInt(image.left, 10),
                    t = parseInt(image.top, 10),
                    filename = image.filename.substring( image.filename.lastIndexOf('/')+1, image.filename.length ),
                    paddedIndex = String('000' + (index + photoCountStart)).slice(-3);

                l = (l>=0)?('+' + l):(l);
                t = (t>=0)?('+' + t):(t);

                if (image.selected === 'true'){
                    output += 'composite -size 1000x1000 -geometry '+
                                w +'x'+ h + l + t +' data/pictures/'+ filename +
                                ' data/moved/base.jpg data/front/' + paddedIndex + '.jpg\n';
                }
            });
            output += 'convert -loop 1 data/moved/*.jpg facelapse.gif\n';
            document.getElementById('output').innerHTML = output;
        });
    }
);
