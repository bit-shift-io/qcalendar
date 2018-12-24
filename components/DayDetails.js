import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import moment from 'moment';
import API from '../helpers/API';
import { EventRegister } from 'react-native-event-listeners'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from './Button'
import Log from '../helpers/Log'
import Theme from '../helpers/Theme'
import Draggable from '../components/Draggable'

export default class DayDetails extends Component {
	
	static defaultProps = {
		style: {}
	}

	state = {
		date: moment.utc(),
		events: [],
	}

	constructor(props) {
		super(props);
		this.setDate = this.setDate.bind(this);
		this._onNewEventPress = this._onNewEventPress.bind(this);
		this._onEventPress = this._onEventPress.bind(this);
		this._onEventDrop = this._onEventDrop.bind(this);
	}

	componentWillMount() {
        var self = this;
        this._eventsChanged = EventRegister.addEventListener(API.EVENTS_CHANGED, (data) => {
            self.setState({events: API.getEventsForDate(self.state.date)});
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this._eventsChanged)
    }

	setDate(date) {
		this.setState({date});
	}

	_onEventDrop(params, event) {
		Log.debug(Log.ONPRESS, "_onEventDrop");
		return this.props.parent.onEventDrop({...params, event});
	}

	_onEventPress(event) {
		Log.debug(Log.ONPRESS, "_onEventPress");
		this.props.parent.onEventPress(event);
	}

	_onNewEventPress() {
		Log.debug(Log.ONPRESS, "_onEventPress");
		this.props.parent._onNewEventPress();
	}

	render() {
		Log.debug(Log.RENDER, "DayDetails Render");

		let selectedDate = this.state.date;
		var eventElements = [];
		if (selectedDate) {
			let events = API.getEventsForDate(selectedDate);
			for (let i = 0; i < events.length; ++i) {
				let event = events[i];
				let startDate = moment.utc(event.startDate);

				let timeElement = null;
				if (!event.allDay) {
					timeElement =	<Text style={[styles.timeText]}>
										| {startDate.format('hh:mm a')}
									</Text>;
				}

				eventElements.push(
					<Draggable key={'dayDetailsEvent' + i} onDrop={(params) => this._onEventDrop(params, event)}>
						<Button viewStyle={styles.eventContainer} onPress={() => this._onEventPress(event)}>
							<View style={[styles.leftHighlight, {backgroundColor: event.calendar.color}]}>
							</View>
							<Text style={[styles.notes_text]}>
								{event.title}
							</Text>
							{timeElement}
						</Button>
					</Draggable>
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

						<Button onPress={this._onNewEventPress}>
							<Icon name='event' size={30} color={Theme.textColor} />
						</Button>
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
		flexDirection: 'row',
	},

	timeText: {
		fontSize: 16,
		paddingLeft: 10,
		color: Theme.dullTextColor, //'#C0C0C0',
	},
	
	notes_text: {
		fontSize: 16,
		paddingLeft: 10,
		color: Theme.textColor,
	},

	notes_selected_date: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'column'
	},
	notes: {
		padding: 10,
		flexDirection: 'row',
		//backgroundColor: '#FAFAFA'
	},
	notes_notes: {
		flex: 3
	},
	
	small_text: {
		fontSize: 15,
		color: Theme.textColor,
	},

	big_text: {
		fontSize: 50,
		fontWeight: 'bold',
		color: Theme.textColor,
	},
	inline: {
		flexDirection: 'row'
	},
});
