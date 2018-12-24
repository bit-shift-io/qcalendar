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
import EditEvent from './views/EditEvent';
import MenuLeft from './views/MenuLeft';
import Settings from './views/Settings';
import SideMenu from './components/SideMenu';
import * as ViewUtils from './helpers/ViewUtils'
import NotificationAPI from './helpers/NotificationAPI';
import API from './helpers/API';

import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation'

// Manifest of possible screens
const AppNavigator = createStackNavigator({
  Calendar: { screen: Calendar },
  EditEvent: { screen: EditEvent },
  Settings: { screen: Settings },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'Calendar'
});

const LeftMenuComponent = (props) => (
  <MenuLeft {...props} />
);

const MyDrawerNavigator = createDrawerNavigator({
  AppNavigator: { screen: AppNavigator },
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
  drawerWidth: ViewUtils.VIEW_WIDTH * 0.8,
  drawerPosition: 'left',
  drawerType: 'front',
  contentComponent: LeftMenuComponent,
});

const AppContainer = createAppContainer(MyDrawerNavigator);

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
    API.init();
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
    /*
    const menuLeft = <MenuLeft key='menuLeft' onItemSelected={this._onMenuLeftItemSelected} />;


    <SideMenu
    menu={menuLeft}
    isOpen={this.state.isOpenLeft}
    onChange={isOpen => this.updateMenuStateLeft(isOpen)}
    menuPosition="left"
    openMenuOffset={ViewUtils.VIEW_WIDTH}
  >
  <Calendar app={this} />
</SideMenu>
*/
    return (
      <AppContainer />    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
