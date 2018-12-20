import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

// https://github.com/tutsplus/create-common-app-layouts-in-react-native

// https://networksynapse.net/quick-introduction-to-react-natives-calendar-events/
import RNCalendarEvents from 'react-native-calendar-events'; // calander

import Icon from 'react-native-vector-icons/FontAwesome';

import { range } from 'lodash';

import Button from '../components/Button';
import Day from '../components/Day';
import DayDetails from '../components/DayDetails';
import API from '../helpers/API';

export default class Calendar extends Component {

	constructor(props) {
		super(props);

		this.fetchEvents = this.fetchEvents.bind(this);
		this.refreshCalendars = this.refreshCalendars.bind(this);
		this._onDayPress = this._onDayPress.bind(this);
		
		var date = new Date();
		this.state = {
	      calendars: [], 	// list of CalDAV calendars to display
	      events: [], 		// what events to display on the calander
	      year: date.getFullYear(),	// selected month
		  month: date.getMonth(),	// selected year
		  selectedDate: moment(), // today!
		  forceUpdateDays: moment(),
	    }
	}

	componentWillMount () {
		API.init();
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

	_onDayPress(day) {
		console.log("day pressed!");
		this._dayDetails.setDate(day.props.date);
	}

	renderDays(weekDays) {
		return weekDays.map((date, index) => {
			return (
				<Day key={this.state.forceUpdateDays.toISOString() + date.toISOString()} date={date} monthStartDate={this.startDate}
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

  	fetchEvents() {

		API.fetchEvents(API.computeStartAndEndOfMonth(this.state.year, this.state.month)).then((events) => {
			console.log("events fetched");
			this.setState({forceUpdateDays: moment()});
		});

	  }
	 
	render() {
		console.log("Calander Render");
		const monthName = moment([this.state.year, this.state.month, 1]).format('MMM');

		return (
			<ScrollView style={styles.container}>
				
				<View style={styles.calendar_weekdays}>
					{ this.renderWeekDays() }
				</View>
				<View style={styles.calendar_days}>
					{ this.renderWeeks() }
				</View>
					
				<DayDetails ref={r => this._dayDetails = r}/>

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