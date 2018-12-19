 
/*
    This class is the View Header and Menu header
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

export default class Day extends Component {

    static defaultProps = {
    }

    tenseOptions = {
        'past': {
            //render: () => this._renderPast()
            viewStyle: styles.pastView,
        },

        'today': {
            //render: () => this._renderToday()
            viewStyle: styles.todayView,
        },

        'future': {
            //render: () => this._renderFuture()
            viewStyle: styles.futureView,
        }
    }

    constructor(props) {
        super(props)
        this._onPress = this._onPress.bind(this);

        const today = moment();
        let tense = 'past'; // isBefore
        if (this.props.date.isSame(today, 'day'))
            tense = 'today';
        else if (this.props.date.isAfter(today, 'day'))
            tense = 'future';

        this.state = {
            tense: tense 
        };
    }

    _onPress() {
        console.log("day pressed");
    }

    render() {
        //const dateStr = this.state.date.format("YY-MM-DD");
        const day = this.props.date.day();

        var eventElements = [];
        for (let i = 0; i < this.props.events.length; ++i) {
            var event = this.props.events[i];
            eventElements.push(
                <Text key={i} style={[styles.tiny_text_left, {color: event.calendar.color}]}>{event.title}</Text>
                );
        }

        const viewStyle = this.tenseOptions[this.state.tense].viewStyle;
        return (
            <Button 
                onPress={this._onPress} 
                styles={[styles.viewContainer, viewStyle]} >	
                    <Text style={styles.tiny_text}>{day}</Text>
                    {eventElements}
            </Button>
        );
    }

}

const styles = StyleSheet.create({

    containerTop: {
        
    },

    pastView: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		padding: 2,
		margin: 2
    },

    viewContainer: {
        flex: 1,
        height: 40,
    },
    
	todayView: {
		flex: 1,
		backgroundColor: 'red',
		padding: 2,
		margin: 2
    },
    
    futureView: {
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
});