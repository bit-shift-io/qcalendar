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

// https://code.tutsplus.com/tutorials/common-react-native-app-layouts-calendar-page--cms-27641
import Calendar from './views/Calendar';

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

    this.state = {
      cal_auth: ''
    }
  }

  componentWillMount () {

    // TODO: move the API.init
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

  render() {
    return (
      <Calendar app={this} />
      );
  }
}

const styles = StyleSheet.create({
});
