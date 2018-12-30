import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  PanResponder,
} from 'react-native';

import { EventRegister } from 'react-native-event-listeners'
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import EditEvent from './EditEvent'
import Theme from '../helpers/Theme'
import InfiniteFlatList from '../components/InfiniteFlatList'

// https://github.com/tutsplus/create-common-app-layouts-in-react-native

// https://networksynapse.net/quick-introduction-to-react-natives-calendar-events/
import RNCalendarEvents from 'react-native-calendar-events'; // calander

import Icon from 'react-native-vector-icons/FontAwesome';

import { range } from 'lodash';

import Button from '../components/Button';
import Day from '../components/Day';
import Week from '../components/Week';
import DayDetails from '../components/DayDetails';
import API from '../helpers/API';
import Log from '../helpers/Log'
import * as ViewUtils from '../helpers/ViewUtils'

export default class Calendar extends Component {

	constructor(props) {
		super(props);

		this._onDayPress = this._onDayPress.bind(this);
		this._onNewEventPress = this._onNewEventPress.bind(this);
		
		var date = new Date();
		this.state = {
	      calendars: [], 	// list of CalDAV calendars to display
	      events: [], 		// what events to display on the calander
	      //year: date.getFullYear(),	// selected month
		  //month: date.getMonth(),	// selected year
		  selectedDate: moment.utc(), // today!
		  forceUpdateDays: moment.utc(),
		  newEventPageVisible: false,
		  viewType: '2-week', //'2-week', //'month'
		}
		
		this._days = [];
		this._yScrollOffset = 0;
	}

	componentWillMount () {
		API.findCalendars();

		API.fetchEvents(this.computeStartAndEndOfMonth()).then((events) => {
			console.log("events fetched");
			this.setState({forceUpdateDays: moment.utc()});
		});
	}

    computeStartAndEndOfMonth() {
		if (this.state.viewType == 'month') {
			let year = this.state.selectedDate.year();
			let month = this.state.selectedDate.month();

			Log.debug('calendar', "year: " + year + " month: " + month);

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
		else if (this.state.viewType == '2-week') {
			const lastSunday = moment.utc(this.state.selectedDate).startOf('week');
			let startDate = moment.utc(lastSunday).subtract(7, 'days');
			let endDate = moment.utc(lastSunday).add(21, 'days');
			return {startDate, endDate};
		}
    }

	renderWeekDays() {
		let weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
		return weekdays.map((day) => {
			return (
				<Text key={'weekday' + day} style={styles.calendar_weekdays_text}>{day.toUpperCase()}</Text>
			);
		});
	}

	onEventDrop({draggable, x, y, event}) {
		Log.debug('calander', 'onEventDrop');

		// modify y by the scroll offset
		y += this._yScrollOffset;

		for (let i = 0; i < this._days.length; ++i) {
			let day = this._days[i];
			if (day && day.isDropArea({x, y})) {

				// move the event from where it was to the selected day
				// and trigger DayDetails to re-render
				Log.debug('Calander', 'Move event: ' + event.id + ' from: ' + event.startDate + ' to:' + day.props.date.toISOString());

				// compute new start and end dates
				let e = Object.assign({}, event);
				let dif = moment.utc(event.endDate).diff(moment.utc(event.startDate));
				e.startDate = day.props.date.toISOString();
				e.endDate = moment.utc(day.props.date).add(dif).toISOString();
				API.saveEvent(e);

				return true;
			}
		}

		return false;
	}

	_onDayPress(day) {
		Log.debug(API.ONPRESS, "day pressed:" + day.props.date.toISOString());
		this._dayDetails.setDate(day.props.date);
		EventRegister.emit(API.DAY_SELECTED, day);
	}

	renderWeeks() {

		let {startDate, endDate} = this.computeStartAndEndOfMonth();
		let totalDays = endDate.diff(startDate, 'days');
		let numberOfWeeks = totalDays / 7;
		/*

		let lastSunday = this.startDate.startOf('week');
		let numberOfDaysFromLastSunday = this.startDate.diff(lastSunday, 'days');
		let numberOfDaysThisMonth = this.startDate.daysInMonth() + 1;

		let totalDays = numberOfDaysFromLastSunday + numberOfDaysThisMonth;
		let numberOfDaysNextMonth = 7 - (totalDays % 7);

		totalDays += numberOfDaysNextMonth;
		let numberOfWeeks = totalDays / 7;
*/
		let weeks = [];
		for (let i = 0; i < numberOfWeeks; ++i) {
			let weekStartDate = moment.utc(startDate);
			weekStartDate = weekStartDate.add(7 * i, 'days');
			weekEndDate = moment.utc(weekStartDate).add(7, 'days');
			weeks.push(
				<Week key={weekStartDate.toISOString()} startDate={weekStartDate} endDate={weekEndDate} onDayPress={this._onDayPress}/>
			);
		}
		return weeks;
	}

	get startDate() {
		return moment.utc([this.state.year, this.state.month, 1]);
	}

	get endDate() {
		this.startDate.add(this.startDate.daysInMonth() - 1, 'days')
	}
	
	_onNewEventPress() {
		//var self = this;
		Log.debug('calendar', '_onNewEventPress');
		this.props.navigation.navigate('EditEvent', {date: this._dayDetails.state.date});
	}

	// when the user presses an event on the DayDetails
	onEventPress(event) {
		this.props.navigation.navigate('EditEvent', {event: event});
	}
	
	_renderNewEventPage() {
		if (!this.state.newEventPageVisible) {
			return (null);
		}

		return (
			<EditEvent parent={this} ref={r => this._editEvent = r} date={this._dayDetails.state.date}/>
		);
	}

	render() {
		Log.debug(Log.RENDER, "Calander Render");
		//const monthName = moment.utc([this.state.year, this.state.month, 1]).format('MMM');
/*
		<InfiniteFlatList />


					{this._renderNewEventPage()}

					{...this.responder.panHandlers}
*/
		let calendarHeight = this.state.viewType == 'month' ? 400 : 280;
		return (
			<View style={styles.container}>

				<ScrollView style={[styles.calendarContainer, {height: calendarHeight}]} ref={r => this._scrollView = r}
					scrollEventThrottle={16} onScroll={e => {
						this._yScrollOffset = e.nativeEvent.contentOffset.y;
					}}>
					
					<View style={styles.calendar_weekdays}>
						{ this.renderWeekDays() }
					</View>
					<View style={styles.calendar_days}>
						{ this.renderWeeks() }
					</View>
						
				</ScrollView>

				<View style={styles.divider}/>

				<ScrollView style={styles.dayDetailsContainer} ref={r => this._dayDetailsScrollView = r}
					scrollEventThrottle={16} onScroll={e => {
						/*this._yScrollOffset = e.nativeEvent.contentOffset.y;*/
					}}>

					<DayDetails ref={r => this._dayDetails = r} parent={this}/>

				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.backgroundColor,
	},

	container: {
		flex: 1,
		backgroundColor: Theme.backgroundColor,
	},

	dayDetailsContainer: {
		flex: 0,
		height: 180,
		backgroundColor: Theme.backgroundColor,
	},

	divider: {
		height: 2,
		width: '100%',
		backgroundColor: 'red',
	},
	
	calendar_weekdays: {
		flexDirection: 'row',
		paddingTop: 10
	},
	calendar_weekdays_text: {
		flex: 1,
		color: Theme.dullTextColor,
		textAlign: 'center'
	},
	week_days: {
		flexDirection: 'row'
	},
});