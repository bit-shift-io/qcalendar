 
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

export default class EditEvent extends Component {
	
	static defaultProps = {
		style: {}
	}

	state = {
        date: moment(),
        fromDateTimePickerVisible: false,
        fromDate: moment(),
        toDate: moment(),
	}

	constructor(props) {
		super(props);
        this.setDate = this.setDate.bind(this);
        this._onShowFromDateTimePicker = this._onShowFromDateTimePicker.bind(this);
        this._onFromDateTimePickerConfirm = this._onFromDateTimePickerConfirm.bind(this);
        this._onFromDateTimePickerCancel = this._onFromDateTimePickerCancel.bind(this);
        this._onNewEventConfirm = this._onNewEventConfirm.bind(this);
	}

	setDate(date) {
		this.setState({date});
    }
    
    _onShowFromDateTimePicker() {
        this.setState({fromDateTimePickerVisible: true});
    }

    _onFromDateTimePickerConfirm(date) {
        console.log('A date has been picked: ', date);
        this.setState({fromDateTimePickerVisible: false, fromDate: moment(date)});
    }

    _onFromDateTimePickerCancel() {
        this.setState({fromDateTimePickerVisible: false});
    }

    _onNewEventConfirm() {

        API.saveEvent({
            title: 'cheese',
            startDate: this.state.fromDate.toISOString(),
            endDate: this.state.fromDate.toISOString(),
        })
        .then(id => {
            console.log("Saved calander event: " + id);
            this.props.parent._onNewEventPress();
        });
    }

	render() {
		console.log("EditEvent Render");
        return (
			<View style={styles.viewContainer}>	

                <View style={styles.rowContainer}>
                    <TextInput style={styles.small_text} placeholder='Title' />
                </View>

                <View style={styles.rowContainer}>
                    <Button onPress={this._onShowFromDateTimePicker}>
                        <Icon name='date-range' size={30} color='#000000' />
                        <Text>From: {this.state.fromDate.format("YY-MM-DD")}</Text>
                    </Button>
                    <DateTimePicker
                        isVisible={this.state.fromDateTimePickerVisible}
                        onConfirm={this._onFromDateTimePickerConfirm}
                        onCancel={this._onFromDateTimePickerCancel}
                        date={this.state.fromDate.toDate()}
                        />
                </View>
                

                <View style={styles.rowContainer}>
                    <TextInput style={styles.small_text} placeholder='Location' />
                </View>

                <View style={styles.rowContainer}>
                    <TextInput style={styles.small_text} placeholder='Description' />
                </View>
				
				<View style={styles.rowContainer}>
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
