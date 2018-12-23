 
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
import API from '../helpers/API';
import { EventRegister } from 'react-native-event-listeners'
import Log from '../helpers/Log'
import Theme from '../helpers/Theme';
import Rect from '../helpers/Rect'
import Color from '../helpers/Color'

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
        this.isDropArea = this.isDropArea.bind(this);
        this._onLayout = this._onLayout.bind(this);

        const today = moment.utc();
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
            events: API.getEventsForDate(this.props.date),
        };
    }

    componentWillMount() {
        var self = this;
        this._eventsChanged = EventRegister.addEventListener(API.EVENTS_CHANGED, (data) => {
            self.setState({events: API.getEventsForDate(self.props.date)});
        });
    }

    _onLayout(e, ref) {
        //Log.debug('day', '_onLayout');
        let self = this;
        ref.measure(
            function(
                x,
                y,
                width,
                height,
                pageX,
                pageY
              ) {
                  //Log.debug('day', "MEASURE: x:" + x + ' y:' + y + ' width:' + width + ' height:' + height + ' pageX:' + pageX + ' pageY:' + pageY);
                  //self.setState({productListContainerHeight: height});
                  self._dimensions = new Rect(pageX, pageY, width, height);
              }
            );
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this._eventsChanged)
    }

    isDropArea({x, y}) {
        Log.debug('day', 'isDropArea');
        return this._dimensions.isPointInside(x, y);
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
        Log.debug(Log.RENDER, "Day Render");
        
        //const dateStr = this.state.date.format("YY-MM-DD");
        let date = this.props.date.date();

        // change number of lines based on number of events
        // ideally I want to measure the text size to fit as much as possible
        let numberOfLines = 10;
        if (this.state.events.length >= 5)
            numberOfLines = 1;
        else if (this.state.events.length >= 3)
            numberOfLines = 2;
        else if (this.state.events.length >= 2)
            numberOfLines = 3;

        let isPast = this.state.tense == 'past';
        let eventTextStyle = this.tenseOptions[this.state.tense].eventTextStyle;
        var eventElements = [];
        for (let i = 0; i < this.state.events.length; ++i) {
            var event = this.state.events[i];
            let color = isPast ? Color.mix(event.calendar.color, Theme.textColor, 0.5) : event.calendar.color;

            eventElements.push(
                <Text key={i} style={[eventTextStyle, {color: color}]} 
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
                onLayout={this._onLayout}
                ref={r => this._button = r}
                onPress={this._onPress} 
                touchableStyle={{flex: 1}}
                viewStyle={[styles.viewContainer, viewStyle]} >	
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
		backgroundColor: Theme.pastDayBackgroundColor,
        padding: 2,
        //backgroundColor: 'green',
    },
    
	todayView: {
		backgroundColor: Theme.currentDayBackgroundColor,
		padding: 1,
		margin: 1
    },
    
    futureView: {
		backgroundColor: Theme.futureDayBackgroundColor,
		padding: 1,
		margin: 1
    },

    notThisMonthView: {
        backgroundColor: 'transparent',
    },
    
    tiny_text: {
		textAlign: 'center',
		color: Theme.dullTextColor,
        fontSize: 10,
        //backgroundColor: 'green',
    },

    fadedText: {
		textAlign: 'left',
		color: Theme.dullTextColor,
        fontSize: 8,
        opacity: 0.5,
        letterSpacing: -0.2,
        //backgroundColor: 'blue',
    },
    
    text: {
		textAlign: 'left',
		color: Theme.dullTextColor,
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