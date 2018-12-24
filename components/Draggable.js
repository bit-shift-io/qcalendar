import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import Theme from '../helpers/Theme';
import Log from '../helpers/Log';

export default class Draggable extends Component {
	
	static defaultProps = {
        onDrop: () => {},
        style: {},
    }
    
    constructor(props) {
        super(props);
        this.state = {
            //pan: new Animated.ValueXY()
        };
    }

    componentWillMount() {
        this._animatedOpacity = new Animated.Value(1);
        this._animatedValue = new Animated.ValueXY()
        this._value = {x: 0, y: 0};
        /*
        this.state.pan.addListener(value => {
            this._val = value
        });*/

        this.panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gesture) => {
                //this._animatedValue.setOffset({x: this._value.x, y: this._value.y});
                //this._animatedValue.setValue({x: 0, y:0});
            },

            onPanResponderMove:
                Animated.event([
                    null, {
                        dx: this._animatedValue.x,
                        dy: this._animatedValue.y
                    }
                ])
            ,

            onPanResponderRelease: (e, gesture) => {
                
                Log.debug('draggable', 'onPanResponderRelease');

                // check if we dropped on anything
                let drop = this.props.onDrop({draggable: this, x: gesture.moveX, y: gesture.moveY});
                if (drop) {
                    Animated.timing(this._animatedOpacity, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }).start(() => console.log("drop done"));
                }
                else {
                    // didnt drop on anything, so spring back to initial location
                    Animated.spring(this._animatedValue, {
                        toValue: {x: 0, y: 0},
                        friction: 5,
                        useNativeDriver: true,
                    }).start();
                }
            }
        });
    }

	render() {
        const panStyle = {
            transform: this._animatedValue.getTranslateTransform(),
            opacity: this._animatedOpacity,
        }
		return (
            <Animated.View 
                {...this.panResponder.panHandlers}
                style={[panStyle, styles.circle, this.props.style]}>
                {this.props.children}
            </Animated.View>
		);
	}
}

let CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
	circle: {
        /*
        backgroundColor: 'blue',
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS,*/
    },
});
