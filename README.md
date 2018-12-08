 
Calander app for Android/iOS using React Native

react native getting started guide: 
https://facebook.github.io/react-native/docs/getting-started.html
click "Building Projects with Native Code" 
we are NOT using Expo!


add to your .bash_profile:

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools


Add to Android/local.properties
sdk.dir = /home/fabian/Android/Sdk/


To run the app for Android after loading the emulator:

    react-native run-android


Using the following custom packages:

https://github.com/wmcmahan/react-native-calendar-events
