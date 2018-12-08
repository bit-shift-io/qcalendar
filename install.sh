 
#!/bin/bash

# setup and install npm and react native
yay -S --noconfirm npm

mkdir ~/.node
echo 'export PATH=$HOME/.node/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
npm config set prefix ~/.node

npm install -g react-native-cli


# setup settings for this project
echo "sdk.dir = /Users/$(whoami)/Library/Android/sdk" > android/local.properties


npm install
