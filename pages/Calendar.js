import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import Moment from 'moment';

import LinearGradient from 'react-native-linear-gradient';

// https://github.com/tutsplus/create-common-app-layouts-in-react-native

// https://networksynapse.net/quick-introduction-to-react-natives-calendar-events/
import RNCalendarEvents from 'react-native-calendar-events'; // calander

import Icon from 'react-native-vector-icons/FontAwesome';

import { range } from 'lodash';

import Button from '../components/Button';

export default class Calendar extends Component {
	
	constructor(props) {
		super(props);

		this.fetchEvents = this.fetchEvents.bind(this);
		this.refreshCalendars = this.refreshCalendars.bind(this);

		var date = new Date();
		this.state = {
	      calendars: [], 	// list of CalDAV calendars to display
	      events: [], 		// what events to display on the calander
	      year: date.getFullYear(),	// selected month
	      month: date.getMonth(),	// selected year
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
		days.forEach((day) => {
		  count += 1;
		  seven_days.push(day);
		  if(count == 7){
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

	renderDays(week_days) {
		return week_days.map((day, index) => {

			var momentDate = Moment([this.state.year, this.state.month, day]);
			var events = this.getEventsForDate(momentDate);
			const dateStr = momentDate.format("YY-MM-DD");

			var eventElements = [];
			for (let i = 0; i < events.length; ++i) {
				var event = events[i];
				eventElements.push(
					<Text key={i} style={[styles.tiny_text_left, {color: event.calendar.color}]}>{event.title}</Text>
					);
			}

			// FABAIN TODO:
			// https://github.com/catalinmiron/react-native-css-gradient
			// this supports repeating gradients

			return (
				<Button 
					key={index} 
					onPress={this.press.bind(this)} 
					styles={{button: styles.day, label: styles.day_text}}
					noDefaultStyles={true}
				>	
					<View style={{flex:1}}>
						<LinearGradient 
							useAngle={true}
							angle={-45}
							angleCenter={{ x: 0.5, y: 0.5}}
            				locations={[0,0.5,0.5, 1.0]}
            				colors={['#ccc', '#ccc', '#dbdbdb', '#dbdbdb']} style={{flex:1}}>
							<Text style={styles.tiny_text}>{day}</Text>
							{eventElements}
						</LinearGradient>
					</View>
				</Button>
			);
		});
	}

	renderWeeks() {
		let past_month_days = range(27, 31);
		let this_month_days = range(1, 30);

		let days = past_month_days.concat(past_month_days, this_month_days);
		let grouped_days = this.getWeeksArray(days);

		return grouped_days.map((week_days, index) => {
			return (
				<View key={index} style={styles.week_days}>
					{ this.renderDays(week_days) }				
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

  	fetchEvents(fn = null) {

  		console.log("year: " + this.state.year + " month: " + this.state.month);

  		Moment.locale('en');
    	var dt = '2016-05-02T00:00:00';

    	const startDate = Moment([this.state.year, this.state.month, 1]).toISOString();

    	// get the number of days for this month
		const daysInMonth = Moment(startDate).daysInMonth();
		console.log("Days in month:" + daysInMonth);

		// we are adding the days in this month to the start date (minus the first day)
		const endDate = Moment(startDate).add(daysInMonth - 1, 'days').toISOString();

    	console.log(Moment([this.state.year, this.state.month, 1]).format('MMM'));
    	console.log("Start Date:" + startDate);
    	console.log("End Date:" + endDate);

		// if calendars is null, it will assume ALL calendars - 3rd arg , /*this.state.calendars* / null
  		RNCalendarEvents.fetchAllEvents(startDate, endDate).then(events => {
  			console.log("Found events: " + events.length);
  			console.log(events);
  			this.setState({events: events});
  			/*
  			if (fn != null) {
	    		fn();
	    	}*/
  		}).catch(error => console.log('Fetch Events Error: ', error));
  	}

	render() {
		const monthName = Moment([this.state.year, this.state.month, 1]).format('MMM');

		return (
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Button 
						noDefaultStyles={true}
						onPress={this.fetchEvents} 
						styles={{button: styles.header_item}}
					>
	                    <View style={styles.header_button}>
	                    	<Icon name="chevron-left" size={30} color="#FFF" />
	                    	<Text style={[styles.header_text]}> Menu</Text>
	                    </View>
	                </Button>
	                <View style={styles.header_item}>
	                	<Text style={[styles.header_text, styles.text_center, styles.bold_text]}>Calendar</Text>
	                </View>
					<View style={styles.header_item}>
	                	<Text style={[styles.header_text, styles.text_right]}>Today</Text>
	                </View>
				</View>
				
				<View>
					<View style={styles.calendar_header}>
						<View style={styles.calendar_header_item}>
							<Button 
								noDefaultStyles={true}
								onPress={this.press.bind(this)}
							>
			                    <Icon name="chevron-left" size={18} color="#333" />
			                </Button>
							<Text style={styles.calendar_header_text}>{this.state.year}</Text>
							<Button 
								noDefaultStyles={true}
								onPress={this.press.bind(this)}
							>
			                    <Icon name="chevron-right" size={18} color="#333" />
			                </Button>
						</View>

						<View style={styles.calendar_header_item}>
							<Button 
								noDefaultStyles={true}
								onPress={this.press.bind(this)}
							>
			                    <Icon name="chevron-left" size={18} color="#333" />
			                </Button>
							<Text style={styles.calendar_header_text}>{monthName}</Text>
							<Button 
								noDefaultStyles={true}
								onPress={this.press.bind(this)}
							>
			                    <Icon name="chevron-right" size={18} color="#333" />
			                </Button>
						</View>
					</View>
					<View style={styles.calendar_weekdays}>
						{ this.renderWeekDays() }
					</View>
					<View style={styles.calendar_days}>
						{ this.renderWeeks() }
					</View>
				</View>

				<View style={styles.notes}>
					<View style={styles.notes_notes}>
						<Text style={styles.notes_text}>Riding my bike around the neighborhood.</Text>
					</View>
					<View style={[styles.notes_selected_date]}>
						<Text style={styles.small_text}>8:23 PM</Text>
						<Text style={styles.big_text}>14</Text>
						<View style={styles.inline}>
							<Icon name="bicycle" size={20} color="#CCC" />
							<Text style={styles.small_text}> THURSDAY</Text>
						</View>
					</View>
				</View>

				<View style={styles.logs}>
					<View>
						<Text style={styles.log_text}>Create New Entry</Text>
						<Text style={styles.log_subtext}>On Thursday, November 14</Text>
					</View>
					<Button 
						noDefaultStyles={true}
						onPress={this.press.bind(this)}
					>
						<Icon name="chevron-right" size={30} color="#CCC" />
					</Button>
				</View>
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
	header: {
		backgroundColor: '#329BCB',
		flexDirection: 'row',
		padding: 20
	},
	header_item: {
		flex: 1
	},
	header_button: {
		flexDirection: 'row'
	},
	text_center: {
		textAlign: 'center'
	},
	text_right: {
		textAlign: 'right'
	},
	header_text: {
		color: '#fff',
		fontSize: 20
	},
	bold_text: {
		fontWeight: 'bold'
	},
	calendar_header: {
		flexDirection: 'row'
	},
	calendar_header_item: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 20,
		paddingRight: 40,
		paddingLeft: 40
	},
	calendar_header_text: {
		fontWeight: 'bold',
		fontSize: 20
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
	day: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		padding: 2,
		margin: 2
	},
	today: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		padding: 2,
		margin: 2
	},

	day_text: {
		textAlign: 'center',
		color: '#A9A9A9',
		fontSize: 25
	},
	tiny_text: {
		textAlign: 'center',
		color: '#A9A9A9',
		fontSize: 10
	},
	tiny_text_left: {
		textAlign: 'left',
		color: '#A9A9A9',
		fontSize: 10
	},
	notes: {
		marginTop: 10,
		padding: 20,
		borderColor: '#F5F5F5',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: '#FAFAFA'
	},
	notes_notes: {
		flex: 3
	},
	notes_text: {
		fontSize: 18
	},
	notes_selected_date: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'column'
	},
	small_text: {
		fontSize: 15
	},
	big_text: {
		fontSize: 50,
		fontWeight: 'bold'
	},
	inline: {
		flexDirection: 'row'
	},
	logs: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderColor: '#F5F5F5',
		borderBottomWidth: 1
	},
	log_text: {
		fontSize: 25
	},
	log_subtext: {
		fontSize: 18
	}
});