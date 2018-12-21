 
/*
    Logging class
*/
import { AsyncStorage } from "react-native"
import moment from 'moment';
import { testData, useTestData } from './TestData';
import RNCalendarEvents from 'react-native-calendar-events'; 
import { EventRegister } from 'react-native-event-listeners'

class Log {

    // channels
    API = 'api';
    RENDER = 'render';
    ONPRESS = 'onpress'; // user interacted with something
    ASYNC = 'async'; // async task completed

    enabled = true; // set to false to disable logging in release builds
    channelsToIgnore = [this.RENDER];

    debug(channel, args) {
        if (!this.enabled)
            return;

        if (this.channelsToIgnore.indexOf(channel) >= 0)
            return;

        console.log(args);
    }
}

// remember to make it singleton when export (with new keyword)
export default new Log();