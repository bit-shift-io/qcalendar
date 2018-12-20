/*
    API for handling the calander
*/
import { AsyncStorage } from "react-native"
import moment from 'moment';
import { testData, useTestData } from './TestData';
import RNCalendarEvents from 'react-native-calendar-events'; 
import { EventRegister } from 'react-native-event-listeners'

class API {

    // events to listen too
    EVENTS_CHANGED = 'eventsChanged';

    events = [];

    constructor() {
        //this.init = this.init.bind(this);
        //this.getEventsForDate = this.getEventsForDate.bind(this);
    }

    async init() {
        var self = this;
        var promise = AsyncStorage.getItem('@API:events')
        .then(req => {
            return JSON.parse(req)
        })
        .then(json => {
            //console.log(json);
            self.events = json;
            if (self.events == null) {
                self.events = [];
            }
            EventRegister.emit(this.EVENTS_CHANGED);
            console.log("Loaded events: " + self.events.length);
        })
        .catch(error => console.error(error));

        return promise;
    }

    computeStartAndEndOfMonth(year, month) {
        console.log("year: " + year + " month: " + month);

        moment.locale('en');
      

      const startDate = moment([year, month, 1]);

      // get the number of days for this month
      const daysInMonth = startDate.daysInMonth();
      console.log("Days in month:" + daysInMonth);

      // we are adding the days in this month to the start date (minus the first day)
      const endDate = moment(startDate).add(daysInMonth - 1, 'days');

      console.log("Start Date:" + startDate.toISOString());
      console.log("End Date:" + endDate.toISOString());

      return {startDate, endDate};
    }

    async fetchEvents({startDate, endDate}) {
        if (useTestData == true) {
            return new Promise(function(resolve, reject) {
                this.events = testData.events;
                AsyncStorage.setItem('@API:events', JSON.stringify(this.events));
                EventRegister.emit(this.EVENTS_CHANGED);
                resolve(this.events);
            });
        }

        try {
            // if calendars is null, it will assume ALL calendars - 3rd arg , /*this.state.calendars* / null
            this.events = await RNCalendarEvents.fetchAllEvents(startDate.toISOString(), endDate.toISOString());
            console.log("Found events: " + this.events.length);
            EventRegister.emit(this.EVENTS_CHANGED);
            await AsyncStorage.setItem('@API:events', JSON.stringify(this.events));
        }
        catch (e) {
            console.error(e);
        }
       
        return this.events;
    }

    getEventsForDate(momentDate) {
		var results = [];
		//const dateStr = momentDate.format("YY-MM-DD");

		for (let i = 0; i < this.events.length; ++i) {
			//console.log("EVENT----------");
			let event = this.events[i];
			//console.log(event);
			var startDate = event.startDate;
			var endDate = event.endDate;

			if (momentDate.isBetween(startDate, endDate)) {
				//console.log("we found an event that spans multiple days, of which " + dateStr + " is inside this range");
				results.push(event);
			}
			else if (momentDate.isSame(startDate, 'day')) {
				//console.log("we found an event that is on " + dateStr);
				results.push(event);
			}

			//console.log("----------");
		}

		return results;
    }

    async saveEvent(event) {
        console.log("AddEvent called");
        console.log(event);

        return RNCalendarEvents.saveEvent(event.title, {
          location:'Our Awesome Place City, State',
          notes: 'Calander Notes',
          description: 'Calander Description',
          startDate: event.startDate,
          endDate: event.endDate,
          calendar: ['Calendar'],
          alarm: [{
            date:-1
          }],
        })
        .then(id => {
          console.log("Saved calander event: " + id + " on: " + event.startDate.toISOString());
    
          // we can get the event ID here if we need it
          //Linking.URL(`cal:${firstTime.getTime()}`);
          return id;
        }).catch(error => console.log('Save Event Error: ', error));
      }
}

// remember to make it singleton when export (with new keyword)
export default new API();
