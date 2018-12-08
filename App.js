/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking} from 'react-native';

// https://networksynapse.net/quick-introduction-to-react-natives-calendar-events/
import RNCalendarEvents from 'react-native-calendar-events'; // calander

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this);
    this.addEvent = this.addEvent.bind(this);

    this.state = {
      cal_auth: ''
    }
  }

  componentWillMount () {
    RNCalendarEvents.authorizationStatus()
         .then(status => {
            console.log("Calander auth status: " + status);

           // if the status was previous accepted, set the authorized status to state
           this.setState({ cal_auth: status })
           if(status === 'undetermined') {
             // if we made it this far, we need to ask the user for access 
             RNCalendarEvents.authorizeEventStore()
             .then((out) => {
               if(out == 'authorized') {
                 // set the new status to the auth state
                 this.setState({ cal_auth: out })
               }
             })
            }
          })
    .catch(error => console.warn('Auth Error: ', error));
/*
    // Android
    RNCalendarEvents.authorizeEventStore()
    .then((out) => {
      if(out == 'authorized') {
        // set the new status to the auth state
        this.setState({ cal_auth: out })
      }
    })
    .catch(error => console.warn('Auth Error: ', error));*/
  }

  listCalanders() {
    RNCalendarEvents.findCalendars().then(calanders =>{
      console.log("Found calanders:");
      console.log(calanders);
    }).catch(error => console.log('Find Calanders Error: ', error));
  }

  addEvent() {
    console.log("AddEvent called");
    var firstTime = new Date('05 January 2019 14:48 UTC');
    var lastTime = new Date('05 January 2019 15:48 UTC');

    RNCalendarEvents.saveEvent('Example Event', {
      location:'Our Awesome Place City, State',
      notes: 'Calander Notes',
      description: 'Calander Description',
      startDate: firstTime.toISOString(),
      endDate: lastTime.toISOString(),
      calendar: ['Calendar'],
      alarm: [{
        date:-1
      }],
    })
    .then(id => {
      console.log("Saved calander event: " + id + " on: " + firstTime.toISOString());

      // we can get the event ID here if we need it
      //Linking.URL(`cal:${firstTime.getTime()}`);
    }).catch(error => console.log('Save Event Error: ', error));
  }

  _onPressButton() {
    //Alert.alert('You tapped the button!');
    this.addEvent();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button
            onPress={this._onPressButton}
            title="Save Test Event"
            color="#841584"
          />
        <Button
            onPress={this.listCalanders}
            title="List Calanders"
            color="#841584"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
