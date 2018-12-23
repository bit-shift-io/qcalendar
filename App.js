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
import MenuLeft from './views/MenuLeft';
import SideMenu from './components/SideMenu';
import ViewUtils from './helpers/ViewUtils';
import NotificationAPI from './helpers/NotificationAPI';

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

    this.toggleLeft = this.toggleLeft.bind(this);
    //this.toggleRight = this.toggleRight.bind(this);
    this.closeSideMenus = this.closeSideMenus.bind(this);
    this._onMenuLeftItemSelected = this._onMenuLeftItemSelected.bind(this);

    this.state = {
      cal_auth: '',
      isOpenLeft: false,
      isOpenRight: false,
      selectedItem: 'About',
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

    NotificationAPI.init();
  }

  toggleLeft() {
    this.setState({
      isOpenLeft: !this.state.isOpenLeft,
    });
  }

  closeSideMenus() {
    this.setState({
      isOpenRight: false,
      isOpenLeft: false,
    });
  }

  _onMenuLeftItemSelected(item) {
    this.setState({
      isOpenLeft: false,
      selectedItem: item,
    });
  }

  updateMenuStateLeft(isOpenLeft) {
    this.setState({ isOpenLeft });
  }

  render() {
    const menuLeft = <MenuLeft key='menuLeft' onItemSelected={this._onMenuLeftItemSelected} />;

    return (
      <SideMenu
          menu={menuLeft}
          isOpen={this.state.isOpenLeft}
          onChange={isOpen => this.updateMenuStateLeft(isOpen)}
          menuPosition="left"
          openMenuOffset={ViewUtils.VIEW_WIDTH}
        >
        <Calendar app={this} />
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
});
