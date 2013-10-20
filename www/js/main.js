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
            newAttributes = [];
        text.get('../data/metadata/data_page_001.json', function(data){
            listData = JSON.parse(data);
            photoList = listData.photos.photo;
            document.getElementById('current').setAttribute('src', photoList[currentIndex].url_c);
            document.getElementById('previous').setAttribute('src', '');
        });
        function updatePhotoURLs(){
            document.getElementById('current').setAttribute('src', photoList[currentIndex].url_c);
            if (photoList[currentIndex-1] !== undefined){
                document.getElementById('previous').setAttribute('src', photoList[currentIndex-1].url_c);
            } else{
                document.getElementById('previous').setAttribute('src', '');
            }
        }
        function updateAttributes(){
            console.log('updateAttributes', newAttributes[currentIndex]);
            if (newAttributes[currentIndex] !== undefined){
                document.getElementById('current').style.width = newAttributes[currentIndex].width;
                document.getElementById('current').style.top = newAttributes[currentIndex].top;
                document.getElementById('current').style.left = newAttributes[currentIndex].left;
            }
            if (newAttributes[currentIndex - 1] !== undefined){
                document.getElementById('previous').style.width = newAttributes[currentIndex - 1].width;
                document.getElementById('previous').style.top = newAttributes[currentIndex - 1].top;
                document.getElementById('previous').style.left = newAttributes[currentIndex - 1].left;
            }
        }
        document.body.addEventListener('keypress', function(event){
            var currentImg = document.getElementById('current'),
                increment = 0;
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
                        case 93:
                            //]
                            increment = 10;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 91:
                            //[
                            increment = -10;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 61:
                            //+
                            increment = 40;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 45:
                            //-
                            increment = -40;
                            currentImg.style.width = (parseInt(currentImg.style.width, 10) + increment) + 'px';
                            currentImg.style.left = (parseInt(currentImg.style.left, 10) - increment/2) + 'px';
                            break;
                        case 46:
                            //>
                            console.log('next');
                            currentIndex += 1;
                            updatePhotoURLs();
                            updateAttributes();
                            break;
                        case 44:
                            //<
                            currentIndex -= 1;
                            updatePhotoURLs();
                            updateAttributes();
                            console.log('previous');
                            break;
                    }
            }
            newAttributes[currentIndex] = {
                'width': currentImg.style.width,
                'left': currentImg.style.left,
                'top': currentImg.style.top,
                'filename': currentImg.src
            };
            document.getElementById('output').innerHTML = JSON.stringify(newAttributes, null, '  ');
        });
    }
);
