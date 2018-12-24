import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
} from 'react-native';
import Log from '../helpers/Log'
import Theme from '../helpers/Theme'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button'
import NotificationAPI from '../helpers/NotificationAPI';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weekStartsOn: 'monday',
        }

    }

    _onStartDayOfWeekPress() {
       
    }

    render() {
        Log.debug(Log.RENDER, 'Settings Render');

        return (
            <View style={styles.viewContainer}>
                
                <Picker
                    itemStyle={{color:'white'}}
                    selectedValue={this.state.weekStartsOn}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({weekStartsOn: itemValue})}>
                    <Picker.Item label="Sunday" value="sunday" />
                    <Picker.Item label="Monday" value="monday" />
                </Picker>
                
                <Button onPress={this._onStartDayOfWeekPress} touchableStyle={{}} viewStyle={[styles.rowContainer, styles.button]}>
                    <Icon name='settings' size={30} color={styles.text.color} />
                    <Text style={styles.text}>Week start sunday/monday</Text>
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