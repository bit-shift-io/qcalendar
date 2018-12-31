/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, View, Button, Alert, Linking, 
  AsyncStorage,
  DrawerLayoutAndroid
} from 'react-native';

// https://networksynapse.net/quick-introduction-to-react-natives-calendar-events/
import RNCalendarEvents from 'react-native-calendar-events'; // calander

// https://code.tutsplus.com/tutorials/common-react-native-app-layouts-calendar-page--cms-27641
import Calendar from './views/Calendar';
import EditEvent from './views/EditEvent';
import MenuLeft from './views/MenuLeft';
import Settings from './views/Settings';
//import SideMenu from './components/SideMenu';
import * as ViewUtils from './helpers/ViewUtils'
import NotificationAPI from './helpers/NotificationAPI';
import API from './helpers/API';
//import BackgroundTask from 'react-native-background-task' // doesnt work with current ver RN
import moment from 'moment';
import BackgroundJob from 'react-native-background-job';

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

const AppContainer = createAppContainer(AppNavigator); //MyDrawerNavigator);

const regularJobKey = "regularJobKey";

BackgroundJob.register({
  jobKey: regularJobKey,
  job: () => { 
    console.log(`Background Job fired!. Key = ${regularJobKey}`)
    var notificationApi = NotificationAPI.init();
    var api = API.init();

    Promise.all([notificationApi, api]).then(() => {

      var today = moment.utc();
      var startDate = moment.utc().startOf('date');
      var endDate = moment.utc().endOf('date');
      var fetch = API.fetchEvents({startDate, endDate}); // TODO: stop this saving over the events key unless it merges them!
      fetch.then(() => {
        var events = API.getEventsForDate(today);
        console.log("todays events:", events);
        for (let i = 0; i < events.length; ++i) {
          let event = events[i];
          let date = moment.utc(event.startDate);
          NotificationAPI.localNotificationSchedule({
            message: event.title,
            bigText: 'qwe',
            subText: event.description,
            id: event.id,
            date: date.toDate(),
            //group: 'qcalendar',
          });
        }
      });
/*
      NotificationAPI.localNotification({
        message: 'Test Background Notification',
      });*/
    });
  }
});

/*
function currentTimestamp(): string {
  const d = new Date()
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
}

BackgroundTask.define(
  async () => {
    console.log('Hello from a background task')

    const value = await AsyncStorage.getItem('@MySuperStore:times')
    await AsyncStorage.setItem('@MySuperStore:times', `${value || ''}\n${currentTimestamp()}`)

    // Or, instead of just setting a timestamp, do an http request
    /* const response = await fetch('http://worldclockapi.com/api/json/utc/now')
    const text = await response.text()
    await AsyncStorage.setItem('@MySuperStore:times', text) * /

    BackgroundTask.finish()
  },
)
*/

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    //this.toggleLeft = this.toggleLeft.bind(this);
    //this.toggleRight = this.toggleRight.bind(this);
    //this.closeSideMenus = this.closeSideMenus.bind(this);
    //this._onMenuLeftItemSelected = this._onMenuLeftItemSelected.bind(this);

    this.state = {
      //cal_auth: '',
      //isOpenLeft: false,
      //isOpenRight: false,
      //selectedItem: 'About',
    }
  }

  componentDidMount() {
    /*
    BackgroundTask.schedule()
    this.checkStatus()
    */

   BackgroundJob.schedule({
      jobKey: regularJobKey,
      //notificationTitle: "Notification title",
      //notificationText: "Notification text",
      period: 5000
  });
  }
/*
  async checkStatus() {
    const status = await BackgroundTask.statusAsync()
    console.log(status.available)

    const value = await AsyncStorage.getItem('@MySuperStore:times')
    console.log('value', value)
  }*/

  componentWillMount () {
    API.init();
    NotificationAPI.init();
  }
/*
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
*/

/*
  _onMenuLeftItemSelected(item) {
    this.setState({
      isOpenLeft: false,
      selectedItem: item,
    });
  }

  updateMenuStateLeft(isOpenLeft) {
    this.setState({ isOpenLeft });
  }
*/

  get navigation() {
    return this.navigationContainer._navigation;
  }

  closeDrawers() {
    this.leftDrawer.closeDrawer();
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
/*
    return (
      <AppContainer />    
    );*/

    var navigationView = (
      <MenuLeft
        ref={r=> this.menuLeft = r}
        app={this}/>
    );
    
    return (
      <DrawerLayoutAndroid
        drawerWidth={ViewUtils.VIEW_WIDTH * 0.8}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        ref={r => this.leftDrawer = r}
        renderNavigationView={() => navigationView}>
        <AppContainer
          ref={r => this.navigationContainer = r}/>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
