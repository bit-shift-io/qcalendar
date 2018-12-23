/*
    API For notifications
*/
import PushNotification from 'react-native-push-notification';
import Log from "./Log";
import API from "./API";
import BackgroundTask from 'react-native-background-task'
import moment from 'moment';

// this shows how to handle notifcations and detect app moving into background
// https://medium.com/@mstifflin/how-to-set-up-local-notifications-for-android-in-react-native-f062232c4be8

// https://github.com/jamesisaac/react-native-background-task#installation
BackgroundTask.define(() => {
    console.log('Hello from a background task');

    NotificationAPI.init();

    NotificationAPI.localNotification({
        message: 'Test Background Notification',
    });

    API.init(); // init calendar

    API.fetchEvents(moment.utc(), moment.utc())
        .then(events => {
            console.log("got some events");
            for (let i = 0; i < events.length; ++i) {
                NotificationAPI.localNotificationSchedule({
                    message: events[i].title,
                    date: events[i].startDate,
                });
            }
        });

    BackgroundTask.finish();
})

class NotificationAPI {

    async init() {
        PushNotification.configure({
            onNotification: function(notification) {
              Log.debug('NotificationAPI', 'NOTIFICATION: ', notification);
            },
            popInitialNotification: true,
        });

        const MIN_15 = 900;
        const HRS_24 = 86400;
        BackgroundTask.schedule({
            period: 1800, // Aim to run every 30 mins - more conservative on battery
        });

        // Optional: Check if the device is blocking background tasks or not
        this.checkStatus()
    }

    async checkStatus() {
        const status = await BackgroundTask.statusAsync()
        if (status.available) {
          // Everything's fine
          return
        }
        
        const reason = status.unavailableReason
        if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
          Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
        } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
          Alert.alert('Restricted', 'Background tasks are restricted on your device')
        }
      }

    localNotification(notifcation) {
        PushNotification.localNotification(notifcation);
    }

    localNotificationSchedule(notifcation) {
        PushNotification.localNotificationSchedule(notifcation);
    }

}

export default new NotificationAPI();