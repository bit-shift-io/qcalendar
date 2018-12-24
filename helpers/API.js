/*
    API for handling the calander
*/
import { AsyncStorage } from "react-native"
import moment from 'moment';
import { testData, useTestData } from './TestData';
import RNCalendarEvents from 'react-native-calendar-events'; 
import { EventRegister } from 'react-native-event-listeners'
import Log from "./Log";

class API {

    // events to listen too
    EVENTS_CHANGED = 'eventsChanged';
    DAY_SELECTED = 'daySelected';

    loadFromLocalStorage = false;
    events = [];
    authorizationStatus = false;

    constructor() {
        //this.init = this.init.bind(this);
        //this.getEventsForDate = this.getEventsForDate.bind(this);
    }

    async init() {
        moment.locale('en');

        var self = this;

        // check for permission
        return RNCalendarEvents.authorizationStatus()
        .then(status => {
            Log.debug(Log.API, "Calander auth status: " + status);

            // if the status was previous accepted, set the authorized status to state
            authorizationStatus = status;
            if(status === 'undetermined') {
                // if we made it this far, we need to ask the user for access 
                RNCalendarEvents.authorizeEventStore()
                .then((out) => {
                    if(out == 'authorized') {
                        // set the new status to the auth state
                        authorizationStatus = out;
                        return this._loadFromLocalStorage();
                    }
                })

                return;
            }

            return this._loadFromLocalStorage();
        })
        .catch(error => console.warn('Auth Error: ', error));
        /*
        // Android
        RNCalendarEvents.authorizeEventStore()
        .then((out) => {
        if(out == 'authorized') {
        // set the new status to the auth state
        this.setState({ cal_auth: out })
        }
        })
        .catch(error => console.warn('Auth Error: ', error));*/        
    }

    _loadFromLocalStorage() {
        if (!this.loadFromLocalStorage)
            return;

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
            Log.debug(Log.API, "Loaded events: " + self.events.length);
        })
        .catch(error => console.error(error));

        return promise;
    }

    // TODO: move to a Date helper class?
    computeStartAndEndOfMonth(year, month) {
        Log.debug(Log.API, "year: " + year + " month: " + month);

        const startDate = moment.utc([year, month, 1]);
        
        /* how to get a date into utc from a none utc date:
        var m = moment([year, month, 1]);
        const startDate2 = moment(m).utc().add(m.utcOffset(), 'm');
        Log.debug(Log.API, "startDate2:" + startDate2.toISOString());
        */

        // get the number of days for this month
        const daysInMonth = startDate.daysInMonth();

        // we are adding the days in this month to the start date (minus the first day)
        const endDate = moment.utc(startDate).add(daysInMonth - 1, 'days');

        let date = startDate.toDate();
        Log.debug(Log.API, "Start Date:" + startDate.toISOString(true));
        Log.debug(Log.API, "End Date:" + endDate.toISOString(true));

        return {startDate, endDate};
    }

    async fetchEvents({startDate, endDate}) {
        var self = this;
        var start = startDate.toISOString();
        var end = endDate.toISOString();
        Log.debug(Log.API, 'fetchEvents start:' + start + ' to end:' + end);

        if (useTestData == true) {
            return new Promise(function(resolve, reject) {
                self.events = testData.events;
                AsyncStorage.setItem('@API:events', JSON.stringify(self.events));
                EventRegister.emit(self.EVENTS_CHANGED);
                resolve(self.events);
            });
        }

        return new Promise(function(resolve, reject) {
            // if calendars is null, it will assume ALL calendars - 3rd arg , /*this.state.calendars* / null
            RNCalendarEvents.fetchAllEvents(start, end).then(events => {
                self.events = events;
                Log.debug(Log.API, "Found events: " + self.events.length);
                EventRegister.emit(self.EVENTS_CHANGED);
                AsyncStorage.setItem('@API:events', JSON.stringify(self.events));
                resolve(self.events);
            })
            .catch(error => console.error('Find Calanders Error: ', error));
        });
    }

    getEventsForDate(momentDate) {
		var results = [];
        const dateStr = momentDate.format("YY-MM-DD");
        if (this.events && momentDate.month() == 11 && momentDate.date() == 29) {
            var nothing = 0;
            ++nothing;
        }

		for (let i = 0; i < this.events.length; ++i) {

			//console.log("EVENT----------");
            let event = this.events[i];
            
            if (event.id == 780) {
                var nothing = 0;
                ++nothing;
            }
            if (event.title == "all day test 2") {
                var nothing = 0;
                ++nothing;
            }
            if (event.allDay == true) {
                var nothing = 0;
                ++nothing;
            }

			//console.log(event);
			var startDate = moment.utc(event.startDate);
			var endDate = moment.utc(event.endDate);

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

    findCalendars() {
        RNCalendarEvents.findCalendars().then(calanders =>{
            Log.debug(Log.API, "Found calanders:");
            Log.debug(Log.API, calanders);
        }).catch(error => console.log('Find Calanders Error: ', error));
      }

    async saveEvent(event) {
        Log.debug(Log.API, "saveEvent called: " + JSON.stringify(event));

        var self = this;
        var event = event;

        // optionally include the id field if it is not null
        var sEvent = Object.assign(event.id ? {
                id: event.id
            } : {}, 
            {
                location: event.location,
                notes: 'Added via QCalendar',
                description: event.description,
                startDate: event.startDate,
                endDate: event.endDate,
                calendarId: event.calendar.id,
                alarm: event.alarm,
                allDay: event.allDay,
            });
        
        return RNCalendarEvents.saveEvent(event.title, sEvent).then(id => {
            Log.debug(Log.API, "saveEvent complete: " + id);

            // search and replace the existing event
            if (event.id != null) {
                self.events = self.events.map(function(item) {
                    if (item.id === event.id) {
                        return event;
                    }
                    
                    return item;
                });

                Log.debug(Log.API, "Edited calander event: " + id);
            }
            else {
                event.id = id;
                Log.debug(Log.API, "Added calander event: " + id);
                self.events.push(event);
            }
            EventRegister.emit(self.EVENTS_CHANGED);
            AsyncStorage.setItem('@API:events', JSON.stringify(self.events));

            return id;
        }).catch(error => {
            console.error(error);
        });
    }

    async removeEvent(eventId) {
        Log.debug(Log.API, "removeEvent called");

        var self = this;
        return RNCalendarEvents.removeEvent(eventId, {futureEvents: false})
        .then(ok => {
            // remove the event
            self.events = self.events.filter(function(item) {
                return item.id !== eventId;
            });

            EventRegister.emit(self.EVENTS_CHANGED);
            AsyncStorage.setItem('@API:events', JSON.stringify(self.events));
            return ok;
        })
        .catch(error => console.log('Remove Event Error: ', error));
    }
}

// remember to make it singleton when export (with new keyword)
export default new API();
