  
/*
    A Week of Days
*/

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text
} from 'react-native'
import moment from 'moment';
import Button from './Button'
import API from '../helpers/API';
import { EventRegister } from 'react-native-event-listeners'
import Log from '../helpers/Log'
import Theme from '../helpers/Theme';
import Rect from '../helpers/Rect'
import Color from '../helpers/Color'
import Day from './Day';

export default class Week extends Component {

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        
        this._onDayPress = this._onDayPress.bind(this);
        /*
        this._days = [];
        for (let i = 0; i < 7; ++i) {
            this._days.append();
        }*/

        this._days = [];

    }

    _onDayPress(day) {
        Log.debug('Week', '_onDayPress');
        this.props.onDayPress(day);
    }

    render() {
        let days = [];
        for (let i = 0; i < 7; ++i) {
            let date = moment.utc(this.props.startDate);
            date = date.add(i, 'days');
            /* monthStartDate={this.startDate} */
            days.push(
                <Day key={'day' + i} date={date} 
                    onPress={this._onDayPress} ref={r => this._days[i] = r}/> 
            );
        }

        return (
            <View style={styles.container}>
                {days}
            </View>
        );
    }
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
});