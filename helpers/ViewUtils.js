import {
    Dimensions,
    Platform,
    StatusBar
} from 'react-native'

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const STATUS_BAR_HEIGHT = IS_IOS ? 0 : StatusBar.currentHeight; // ios has no status bar height

export const WINDOW_HEIGHT = Dimensions.get("window").height;
export const WINDOW_WIDTH = Dimensions.get("window").width;

// this takes into account the status bar, which the "window" doesn't
export const VIEW_HEIGHT = WINDOW_HEIGHT - STATUS_BAR_HEIGHT;
export const VIEW_WIDTH = WINDOW_WIDTH;


/*
    Often we have an array of items, we want to space them with some padding
    this code will generate the style given then:

    index - current index of the array item
    total - total number of items in the array
    paddingSettings {
        paddingTop          - the padding before the arry of items
        paddingBetween      - the padding after the array of items
        paddingBottom       - the padding between items
        paddingHorizontal   - left and right padding
    }
*/
function arrayVerticalPaddingStyle(index, total, paddingSettings) {
    let top = 0;
    let bottom = 0;
    let between = 0;

    // first
    if (index == 0) {
        top = paddingSettings.hasOwnProperty('paddingTop') ? paddingSettings.paddingTop : 0;
    }

    // last
    if (index == (total - 1)) {
        bottom = paddingSettings.hasOwnProperty('paddingBottom') ? paddingSettings.paddingBottom : 0;
    }
    // not last
    else {
        bottom = paddingSettings.hasOwnProperty('paddingBetween') ? paddingSettings.paddingBetween : 0;
    }

    return { paddingTop: top, paddingBottom: bottom, paddingHorizontal: paddingSettings.hasOwnProperty('paddingHorizontal') ?  paddingSettings.paddingHorizontal : 0};
}

export default {
    arrayVerticalPaddingStyle,
};
