import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import moment from 'moment';

export default class DayDetails extends Component {
	
	static defaultProps = {
		style: {}
	}

	state = {
		date: moment(),
		events: [],
	}

	constructor(props) {
		super(props);
		this.setDate = this.setDate.bind(this);
	}

	setDate(date) {
		this.setState({date});
	}

	render() {
		console.log("DayDetails Render");

		let selectedDate = this.state.date;
		var eventElements = [];
		if (selectedDate) {
			let events = this.props.getEventsForDate(selectedDate);
			for (let i = 0; i < events.length; ++i) {
				let event = events[i];
				let startDate = moment(event.startDate);
				eventElements.push(
					<View key={'dayDetailsEvent' + i} style={styles.eventContainer}>
						<View style={[styles.leftHighlight, {backgroundColor: event.calendar.color}]}>
						</View>
						<Text style={[styles.notes_text]}>
							{event.title} | {startDate.format('hh:mm a')}
						</Text>
					</View>
					);
			}
		}

		  return (
			<View style={styles.notes}>	
					<View style={styles.notes_notes}>
						{eventElements}
					</View>
					<View style={[styles.notes_selected_date]}>
						<Text style={styles.small_text}>{selectedDate.format('MMMM').toUpperCase()}</Text>
						<Text style={styles.big_text}>{selectedDate.date()}</Text>
						<View style={styles.inline}>
							<Text style={styles.small_text}> {selectedDate.format('dddd').toUpperCase()}</Text>
						</View>
					</View>
				</View>
		  );
	}
}

const styles = StyleSheet.create({

    leftHighlight: {
		//flex:1,
        width: 4,
        backgroundColor: 'red',
        height: '100%',
        position: 'absolute',
		left: 0,
		//marginBottom: 10
		//left: -20,
        // zIndex isnt working... so leave this for now
        //bottom: -AppStyle.SIZE_1,
        //zIndex: 1000,
	},

	eventContainer: {
		paddingBottom: 2,
	},
	
	notes_text: {
		fontSize: 14,
		paddingLeft: 10,
	},

	notes_selected_date: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'column'
	},
	notes: {
		padding: 10,
		flexDirection: 'row',
		backgroundColor: '#FAFAFA'
	},
	notes_notes: {
		flex: 3
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
});
