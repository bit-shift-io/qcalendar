import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

export default class Button extends Component {
	
	static defaultProps = {
		style: {}
	}

	render() {
		return (
			<TouchableHighlight 
				underlayColor="#ccc" 
				onPress={this.props.onPress} 
				style={[{flex: 1}, this.props.style]}>

				<View style={[this.props.style]}>
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
