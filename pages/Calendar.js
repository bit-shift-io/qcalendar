import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import { testData, useTestData } from '../helpers/TestData';

// https://github.com/tutsplus/create-common-app-layouts-in-react-native

// https://networksynapse.net/quick-introduction-to-react-natives-calendar-events/
import RNCalendarEvents from 'react-native-calendar-events'; // calander

import Icon from 'react-native-vector-icons/FontAwesome';

import { range } from 'lodash';

import Button from '../components/Button';
import Day from '../components/Day';
import DayDetails from '../components/DayDetails';

export default class Calendar extends Component {

	constructor(props) {
		super(props);

		this.fetchEvents = this.fetchEvents.bind(this);
		this.refreshCalendars = this.refreshCalendars.bind(this);
		this._onDayPress = this._onDayPress.bind(this);
		this.getEventsForDate = this.getEventsForDate.bind(this);
		
		var date = new Date();
		this.state = {
	      calendars: [], 	// list of CalDAV calendars to display
	      events: [], 		// what events to display on the calander
	      year: date.getFullYear(),	// selected month
		  month: date.getMonth(),	// selected year
		  selectedDate: moment(), // today!
	    }


	    //this.fetchEvents();
	    /*
	    // refresh the calanders
	    // get all events for this month
	    this.refreshCalendars(() => { 
	    	this.fetchEvents() 
	    });*/
	}

	componentWillMount () {
		this.fetchEvents(); // fetch events for the current month
	}

	renderWeekDays() {
		let weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
		return weekdays.map((day) => {
			return (
				<Text key={day} style={styles.calendar_weekdays_text}>{day.toUpperCase()}</Text>
			);
		});
	}

	getWeeksArray(days) {
		var weeks_r = [];
		var seven_days = [];
		var count = 0;
		days.forEach((day, index) => {
		  count += 1;
		  seven_days.push(day);
		  if(count == 7 || index == (days.length - 1)) {
		    weeks_r.push(seven_days)
		    count = 0;
		    seven_days = [];
		  }
		});
		return weeks_r;
	}

	getEventsForDate(momentDate) {

		var results = [];
		const dateStr = momentDate.format("YY-MM-DD");

		for (let i = 0; i < this.state.events.length; ++i) {
			//console.log("EVENT----------");
			let event = this.state.events[i];
			console.log(event);
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

	_onDayPress(day) {
		console.log("day pressed!");


		/*
		day.setSelected(true);
		if (this.state.selectedDay) {
			this.state.selectedDay.setSelected(false);
		}*/
		//this.setState({selectedDate: day.props.date});
		this._dayDetails.setDate(day.props.date);
	}

	renderDays(weekDays) {
		return weekDays.map((date, index) => {
			var events = this.getEventsForDate(date);
			return (
				<Day key={date.toISOString()} events={events} date={date} monthStartDate={this.startDate}
					onPress={this._onDayPress}/>
			);
		});
	}

	renderWeeks() {
		let lastSunday = this.startDate.startOf('week');
		let numberOfDaysFromLastSunday = this.startDate.diff(lastSunday, 'days');

		let pastMonthDays = range(lastSunday.date(), lastSunday.date() + numberOfDaysFromLastSunday);
		let thisMonthDays = range(1, this.startDate.daysInMonth() + 1);
		let totalDays = pastMonthDays.length + thisMonthDays.length;
		let numberOfDaysNextMonth = 7 - (totalDays % 7);
		let nextMonthDays = range(1, numberOfDaysNextMonth + 1);

		let lastMonth = this.startDate.subtract(1, 'months');
		let pastMonthDates = pastMonthDays.map((item, index) => {
			return moment([lastMonth.year(), lastMonth.month(), item]);
		});

		let thisMonthDates = thisMonthDays.map((item, index) => {
			return moment([this.state.year, this.state.month, item]);
		});

		let nextMonth = this.startDate.add(1, 'months');
		let nextMonthDates = nextMonthDays.map((item, index) => {
			return moment([nextMonth.year(), nextMonth.month(), item]);
		});

		let dates = pastMonthDates.concat(thisMonthDates, nextMonthDates);
		let groupedDates = this.getWeeksArray(dates);

		return groupedDates.map((weekDays, index) => {
			return (
				<View key={index} style={styles.week_days}>
					{ this.renderDays(weekDays) }				
				</View>
			);
		});
	}


	refreshCalendars(fn = null) {
	    RNCalendarEvents.findCalendars().then(calendars =>{
	    	console.log("Found calendars: " + calendars.length);
	    	this.setState({calendars: calendars});
	    	if (fn != null) {
	    		fn();
	    	}
	    }).catch(error => console.log('Find Calanders Error: ', error));
  	}

	get startDate() {
		return moment([this.state.year, this.state.month, 1]);
	}

	get endDate() {
		this.startDate.add(this.startDate.daysInMonth() - 1, 'days')
	}

  	fetchEvents(fn = null) {

  		console.log("year: " + this.state.year + " month: " + this.state.month);

  		moment.locale('en');
    	var dt = '2016-05-02T00:00:00';

    	const startDate = moment([this.state.year, this.state.month, 1]).toISOString();

    	// get the number of days for this month
		const daysInMonth = moment(startDate).daysInMonth();
		console.log("Days in month:" + daysInMonth);

		// we are adding the days in this month to the start date (minus the first day)
		const endDate = moment(startDate).add(daysInMonth - 1, 'days').toISOString();

    	console.log(moment([this.state.year, this.state.month, 1]).format('MMM'));
    	console.log("Start Date:" + startDate);
    	console.log("End Date:" + endDate);

		if (useTestData == true) {
			this.setState({events: testData.events});
		}
		else {
			// if calendars is null, it will assume ALL calendars - 3rd arg , /*this.state.calendars* / null
			RNCalendarEvents.fetchAllEvents(startDate, endDate).then(events => {
				console.log("Found events: " + events.length);
				//console.log(events);
				this.setState({events: events});
				/*
				if (fn != null) {
					fn();
				}*/
		  	}).catch(error => console.log('Fetch Events Error: ', error));
		}
	  }
	  /*
	  _renderSelectedDay() {
		let selectedDate = this.state.selectedDate;
		var eventElements = [];
		if (selectedDate) {
			let events = this.getEventsForDate(selectedDate);
			for (let i = 0; i < events.length; ++i) {
				var event = events[i];
				eventElements.push(
					<Text key={i} style={[styles.notes_text, {color: event.calendar.color}]}>
						{event.title}
					</Text>
					);
			}
		}

		  return (
			<View style={styles.notes}>	
					<View style={styles.notes_notes}>
						{eventElements}
					</View>
					<View style={[styles.notes_selected_date]}>
						<Text style={styles.big_text}>{selectedDate.date()}</Text>
						<View style={styles.inline}>
							<Text style={styles.small_text}> {selectedDate.format('dddd').toUpperCase()}</Text>
						</View>
					</View>
				</View>
		  );
	  }
*/

	render() {
		console.log("Calander Render");
		const monthName = moment([this.state.year, this.state.month, 1]).format('MMM');

		// TODO: move getEvent ... to its own class and pass that around
		return (
			<ScrollView style={styles.container}>
				
				<View style={styles.calendar_weekdays}>
					{ this.renderWeekDays() }
				</View>
				<View style={styles.calendar_days}>
					{ this.renderWeeks() }
				</View>
					
				<DayDetails ref={r => this._dayDetails = r} getEventsForDate={this.getEventsForDate}/>

			</ScrollView>
		);
	}

	press() {
		
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	
	calendar_weekdays: {
		flexDirection: 'row',
		paddingTop: 10
	},
	calendar_weekdays_text: {
		flex: 1,
		color: '#C0C0C0',
		textAlign: 'center'
	},
	week_days: {
		flexDirection: 'row'
	},
});