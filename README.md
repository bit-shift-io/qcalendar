 
Calander app for Android/iOS using React Native

react native getting started guide: 
https://facebook.github.io/react-native/docs/getting-started.html
click "Building Projects with Native Code" 
we are NOT using Expo!

Ensure Android Studio is installed

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


lodash
react-native-vector-icons
react-native-linear-gradient
moment
https://www.npmjs.com/package/react-native-modal-datetime-picker
https://github.com/jamesisaac/react-native-background-task#installation <-- OLD
https://github.com/zo0r/react-native-push-notification
https://github.com/vikeri/react-native-background-job <-- NEW



useful command lines for react:

react-native start
react-native run-android
react-native log-android



To debug background tasks:

adb logcat *:S ReactNative:V ReactNativeJS:V