 
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
            eventTextStyle: styles.fadedText,
        },

        'today': {
            //render: () => this._renderToday()
            viewStyle: styles.todayView,
            eventTextStyle: styles.text,
        },

        'future': {
            //render: () => this._renderFuture()
            viewStyle: styles.futureView,
            eventTextStyle: styles.text,
        },
    }

    constructor(props) {
        super(props)
        this._onPress = this._onPress.bind(this);
        this.setSelected = this.setSelected.bind(this);

        const today = moment();
        let tense = 'past'; // isBefore
        if (this.props.date.isSame(today, 'day'))
            tense = 'today';
        else if (this.props.date.isAfter(today, 'day'))
            tense = 'future';
        else
            tense = 'past';

        this.state = {
            tense: tense,
            selected: false,
        };
    }

    setSelected(selected) {
        this.setState({selected});
    }

    _onPress() {
        console.log("day pressed");
        this.props.onPress(this);
    }

    _renderTopHighlight() {
        if (this.state.tense != 'today') {
            return (null);
        }

        return (
            <View style={[styles.topHighlight]}>
            </View>
        );
    }

    render() {
        console.log("Day Render");
        
        //const dateStr = this.state.date.format("YY-MM-DD");
        let date = this.props.date.date();

        // change number of lines based on number of events
        // ideally I want to measure the text size to fit as much as possible
        let numberOfLines = 10;
        if (this.props.events.length >= 5)
            numberOfLines = 1;
        else if (this.props.events.length >= 3)
            numberOfLines = 2;
        else if (this.props.events.length >= 2)
            numberOfLines = 3;

        let eventTextStyle = this.tenseOptions[this.state.tense].eventTextStyle;
        var eventElements = [];
        for (let i = 0; i < this.props.events.length; ++i) {
            var event = this.props.events[i];
            eventElements.push(
                <Text key={i} style={[eventTextStyle, {color: event.calendar.color}]} 
                    numberOfLines={numberOfLines} ellipsizeMode={'clip'}>
                    {event.title}
                </Text>
                );
        }

        let viewStyle = this.tenseOptions[this.state.tense].viewStyle;

        // don't show the day of the month if it doesnt belong to this month
        if (this.props.monthStartDate.month() != this.props.date.month()) {
            date = '';
            viewStyle = styles.notThisMonthView;
        }

        return (
            <Button 
                onPress={this._onPress} 
                style={[styles.viewContainer, viewStyle]} >	
                    {this._renderTopHighlight()}
                    <Text style={styles.tiny_text}>{date}</Text>
                    {eventElements}
            </Button>
        );
    }

}

const styles = StyleSheet.create({

    containerTop: {
        
    },

    viewContainer: {
        flex: 1,
        height: 80,
        overflow: 'hidden',
    },

    pastView: {
		backgroundColor: '#F5F5F5',
        padding: 2,
        //backgroundColor: 'green',
    },
    
	todayView: {
		backgroundColor: 'white',
		padding: 1,
		margin: 1
    },
    
    futureView: {
		backgroundColor: 'white',
		padding: 1,
		margin: 1
    },

    notThisMonthView: {
        backgroundColor: 'transparent',
    },
    
    tiny_text: {
		textAlign: 'center',
		color: '#A9A9A9',
        fontSize: 10,
        //backgroundColor: 'green',
    },

    fadedText: {
		textAlign: 'left',
		color: '#A9A9A9',
        fontSize: 8,
        opacity: 0.5,
        letterSpacing: -0.2,
        //backgroundColor: 'blue',
    },
    
    text: {
		textAlign: 'left',
		color: '#A9A9A9',
        fontSize: 8,
        opacity: 1.0,
        letterSpacing: -0.2,
        //backgroundColor: 'blue',
    },

    topHighlight: {
        width: '100%',
        backgroundColor: 'red',
        height: 2,
        position: 'absolute',
        top: 0,
        // zIndex isnt working... so leave this for now
        //bottom: -AppStyle.SIZE_1,
        //zIndex: 1000,
    }
});