![Facelapse example](http://i.imgur.com/7OjPG19.gif)

# 1 install
    git clone https://github.com/fczuardi/facelapse.git
    cd facelapse
    npm install

# 2 enter your flickr API credentials
    cp config/flickr_keys.example.js config/flickr_keys.js
(edit that file and save)

# 3 download the pictures
    mkdir -p data/pictures
    node bin/get_photos

# 4 download the metadata
    mkdir -p data/metadata

# 5 use the web UI
* serve www/index.html with your web server of choice and open it on a browser (tested with Firefox Nightly)
* use the keyboard shortcuts:
  * s: select a photo to be used in the facelapse
  * . and ,: go to next and previous picture
  * > and <: go to next and previous selected picture
  * arrow keys: move the picture
  * shift+arrow keys: move the picture with bigger steps
  * ] and [: scale up or down
  * = and -: scale up or down with bigger steps
* copy the generated imagemagick commands

# 6 run the generated imagemagic code
    mkdir -p data/moved

(paste the code from the web UI into your terminal)
