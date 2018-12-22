import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Theme from '../helpers/Theme';

export default class Button extends Component {
	
	static defaultProps = {
		touchableStyle: {},
		viewStyle: {}
	}

	render() {
		return (
			<TouchableHighlight 
				underlayColor={Theme.buttonHighlightColor} 
				onPress={this.props.onPress} 
				style={this.props.touchableStyle}>

				<View style={[this.props.viewStyle]}>
					{this.props.children}	
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
});
