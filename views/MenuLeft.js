import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Log from '../helpers/Log'
import Theme from '../helpers/Theme'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button'
import NotificationAPI from '../helpers/NotificationAPI';

export default class MenuLeft extends Component {
    constructor(props) {
        super(props);
    }

    _onSettingsPress() {
        Log.debug(Log.ONPRESS, '_onSettingsPress');
    }

    _onTestNotificationPress() {
        Log.debug(Log.ONPRESS, '_onTestNotificationPress');
        /*
        NotificationAPI.localNotification({
            message: 'Test Notification',
        });
*/
        NotificationAPI.localNotificationSchedule({
            message: 'Test Notification Schedule',
            date: new Date(Date.now() + (3 * 1000)),
        });
    }

    render() {
        Log.debug(Log.RENDER, 'MenuLeft Render');

        return (
            <View style={styles.viewContainer}>
                
                <Button onPress={this._onSettingsPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='settings' size={30} color={styles.text.color} />
                    <Text style={styles.text}>Settings</Text>
                </Button>

                <View style={styles.divider}/>

                <Button onPress={this._onDeleteEventPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='view-agenda' size={30} color={styles.text.color} />
                    <Text style={styles.text}>Month</Text>
                </Button>

                <Button onPress={this._onDeleteEventPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='view-day' size={30} color={styles.text.color} />
                    <Text style={styles.text}>2 Week</Text>
                </Button>

                <View style={styles.divider}/>

                <Button onPress={this._onDeleteEventPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='train' size={30} color={styles.text.color} />
                    <Text style={styles.text}>Sync</Text>
                </Button>

                <Button onPress={this._onDeleteEventPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='time-to-leave' size={30} color={styles.text.color} />
                    <Text style={styles.text}>Select Today</Text>
                </Button>

                <View style={styles.divider}/>

                <Button onPress={this._onDeleteEventPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='check' size={30} color={'red'} />
                    <Text style={styles.text}>supagu@gmail.com</Text>
                </Button>

                <Button onPress={this._onDeleteEventPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='close' size={30} color={'blue'} />
                    <Text style={styles.text}>Contacts</Text>
                </Button>

                <View style={styles.divider}/>

                <Button onPress={this._onTestNotificationPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='close' size={30} color={'blue'} />
                    <Text style={styles.text}>Test Notification</Text>
                </Button>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.menu.backgroundColor,
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'blue'
    },

    text: {
        color: Theme.menu.textColor,
    },

    button: {
        //justifyContent: 'center',
        //alignItems: 'center',
        padding: 10,
    },

    divider: {
        backgroundColor: Theme.menu.textColor,
        height: 2,
        width: '100%',
        opacity: 0.2,
        marginLeft: 10,
        marginRight: 10,
    },
});