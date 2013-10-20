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

# 6 run the generated imagemagic code
    mkdir -p data/moved

(paste the code from the web UI into your terminal)
