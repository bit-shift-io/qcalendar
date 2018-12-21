 
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
  View
} from 'react-native';
import moment from 'moment';
import API from '../helpers/API';
import { EventRegister } from 'react-native-event-listeners'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button'
import DateTimePicker from 'react-native-modal-datetime-picker';
import Log from '../helpers/Log'

export default class EditEvent extends Component {
	
	static defaultProps = {
        style: {},
        date: moment.utc(),
	}

	constructor(props) {
		super(props);
        this.setDate = this.setDate.bind(this);
        this.editEvent = this.editEvent.bind(this);

        this._onShowStartDateTimePicker = this._onShowStartDateTimePicker.bind(this);
        this._onStartDateTimePickerConfirm = this._onStartDateTimePickerConfirm.bind(this);
        this._onStartDateTimePickerCancel = this._onStartDateTimePickerCancel.bind(this);

        this._onShowEndDateTimePicker = this._onShowEndDateTimePicker.bind(this);
        this._onEndDateTimePickerConfirm = this._onEndDateTimePickerConfirm.bind(this);
        this._onEndDateTimePickerCancel = this._onEndDateTimePickerCancel.bind(this);

        this._onNewEventConfirm = this._onNewEventConfirm.bind(this);
        this._onDeleteEventPress = this._onDeleteEventPress.bind(this);

        this.state = {
            startDateTimePickerVisible: false,
            startDate: this.props.date,
            startDateModified: false, // modified by user?
            endDateTimePickerVisible: false,
            endDate: this.props.date,
            endDateModified: false, // modified by user?

            event: {
                id: null,
                title: '',
                location: '',
                description: '',
            }
        }
	}

    // user pressed on an event so lets populate this dialog
    editEvent(event) {
        let startDate = moment.utc(event.startDate);
        let endDate = moment.utc(event.endDate);
        this.setState({event, startDate, endDate});
    }

    // called when the user changes the date on the calendar
	setDate(date) {
        if (!this.state.endDateModified) {
            this.setState({endDate: moment.utc(date)});
        }
        if (!this.state.startDateModified) {
            this.setState({startDate: moment.utc(date)});
        }
    }
    
    _onShowStartDateTimePicker() {
        this.setState({startDateTimePickerVisible: true});
    }

    _onStartDateTimePickerConfirm(date) {
        console.log('A date has been picked: ', date);
        // TODO: make sure end date is at least equal/ infront of startDate
        this.setState({startDateModified: true, startDateTimePickerVisible: false, startDate: moment.utc(date)});

        // change end date to follow the start date, unless the user 
        // has specified an end date
        if (!this.state.endDateModified) {
            this.setState({endDate: moment.utc(date)});
        }
    }

    _onStartDateTimePickerCancel() {
        this.setState({startDateTimePickerVisible: false});
    }


    _onShowEndDateTimePicker() {
        this.setState({endDateTimePickerVisible: true});
    }

    _onEndDateTimePickerConfirm(date) {
        console.log('A date has been picked: ', date);
        this.setState({endDateModified: true, endDateTimePickerVisible: false, endDate: moment.utc(date)});
    }

    _onEndDateTimePickerCancel() {
        this.setState({endDateTimePickerVisible: false});
    }

    _isDateRangeOk() {
        return this.state.endDate.isSameOrAfter(this.state.startDate);
    }


    _onNewEventConfirm() {
        // validate form, buisness calander bypasses this by giving you
        // a range picker that doesnt let it srhink below 1 day! 
        if (!this._isDateRangeOk()) {
            return;
        }

        let startDate = this.state.startDate;
        let endDate = this.state.endDate;
        let allDay = false;
        if (!this.state.endDateModified) {
            allDay = true;
        }

        let titleText = this.state.event.title;
        let titleExp = /(\d+):?(\d{1,2})?(\s)?(am|a|pm|p)?/i;
        let timeMatch = titleText.match(titleExp);
        let title = titleText;

        startDate.second(0); endDate.second(0);
        if (timeMatch && timeMatch.length && parseInt(timeMatch[0]) <= 23) {
            // if we detect a number by itself, its not a time!
            if (timeMatch[2] || timeMatch[4]) {
                // time is good, so lets remove it from the title:
                title = titleText.replace(titleExp, '').trim();
                allDay = false;

                // now compute the time
                let hours = parseInt(timeMatch[1]);
                let min = 0;
                if (timeMatch[2]) {
                    min = parseInt(timeMatch[2]);
                    if (min <= 5)
                        min *= 10;
                }

                // most people wont be scheduling tasks after 8pm or before 8am
                let a = hours > 8 ? 'am' : 'pm';
                if (timeMatch[4])
                    a = timeMatch[4];

                if (a.startsWith('p') && hours < 12)
                    hours += 12;

                startDate.hour(hours); endDate.hour(hours);
                startDate.minute(min); endDate.minute(min);
                endDate.add(1, 'hours');
            }
        }

        API.saveEvent({
            ...this.state.event, // event id is in here!
            title: title,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            allDay: allDay,
            calendar:{isPrimary: false, color: '#9A9CFF', id:'5'},
            alarm: [{
                date:-1
            }],
        })
        .then(id => {
            console.log("Saved calander event: " + id);
            this.props.parent._onNewEventPress();
        });
    }

    _onDeleteEventPress() {
        API.removeEvent(this.state.event.id).then(ok => {
            Log.debug(Log.ASYNC, "Deleted calander event:" + this.state.event.id);
            this.props.parent._onNewEventPress();
        });
    }

    _renderDeleteButton() {
        // id is null if we are creating a new event
        // in which case we dont need a delete button!
        if (this.state.event.id == null)
            return null;

        return (
            <Button onPress={this._onDeleteEventPress}>
                <Icon name='delete' size={30} color='#000000' />
            </Button>
        );
    }

	render() {
        Log.debug(Log.RENDER, "EditEvent Render");
        
        let dateRangeOk = this._isDateRangeOk();

        return (
			<View style={styles.viewContainer}>	

                <View style={styles.rowContainer}>
                    <TextInput style={[{flex: 1}, styles.small_text, styles.formField]} 
                        placeholder='Title and Time'
                        onChangeText={(text) => this.setState({event: {...this.state.event, title: text}})} 
                        value={this.state.event.title}/>
                </View>

                <View style={styles.rowContainer}>
                    <Icon name='date-range' size={30} color='#000000' />

                    <Button onPress={this._onShowStartDateTimePicker} 
                        style={[styles.formField]}>
                        <Text>{this.state.startDate.format("MMM DD, YYYY")}</Text>
                    </Button>
                    <DateTimePicker
                        isVisible={this.state.startDateTimePickerVisible}
                        onConfirm={this._onStartDateTimePickerConfirm}
                        onCancel={this._onStartDateTimePickerCancel}
                        date={this.state.startDate.toDate()}
                        />

                    <Button onPress={this._onShowEndDateTimePicker} 
                        style={[styles.formField, {backgroundColor: dateRangeOk ? styles.formField.backgroundColor : 'red'}]}>
                        <Text>{this.state.endDate.format("MMM DD, YYYY")}</Text>
                    </Button>
                    <DateTimePicker
                        isVisible={this.state.endDateTimePickerVisible}
                        onConfirm={this._onEndDateTimePickerConfirm}
                        onCancel={this._onEndDateTimePickerCancel}
                        date={this.state.endDate.toDate()}
                        />
                </View>
                

                <View style={styles.rowContainer}>
                    <TextInput style={[{flex: 1}, styles.small_text, styles.formField]} 
                        placeholder='Location'
                        onChangeText={(text) => this.setState({event: {...this.state.event, location: text}})}
                        value={this.state.event.location}/>
                </View>

                <View style={styles.rowContainer}>
                    <TextInput style={[{flex: 1}, styles.small_text, styles.formField]} 
                        placeholder='Description'
                        onChangeText={(text) => this.setState({event: {...this.state.event, description: text}})}
                        value={this.state.event.description}/>
                </View>
				
				<View style={styles.rowContainer}>
                    {this._renderDeleteButton()}

                    <Button onPress={this.props.parent._onNewEventPress}>
                        <Icon name='close' size={30} color='#000000' />
                    </Button>
                    
                    <Button onPress={this._onNewEventConfirm}>
                        <Icon name='check' size={30} color='#000000' />
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
    
    formField: {
        borderBottomWidth: 2,
        borderBottomColor: '#C0C0C0',
        backgroundColor: '#F5FCFF',
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
	viewContainer: {
		padding: 10,
		flexDirection: 'column',
		backgroundColor: 'white'
    },
    
    rowContainer: {
        flexDirection: 'row',
        //backgroundColor: 'blue'
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
