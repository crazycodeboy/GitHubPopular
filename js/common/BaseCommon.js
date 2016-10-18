/**
 * BaseCommon
 * 公共逻辑处理
 * @flow
 */
'use strict';


import React, {Component} from 'react';
import {
    BackAndroid,
} from 'react-native';


export default class BaseCommon {
    constructor(props) {
        this._onHardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }
    componentDidMount() {
        if(this.props.backPress)BackAndroid.addEventListener('hardwareBackPress',this._onHardwareBackPress);
    }
    componentWillUnmount() {
        if(this.props.backPress)BackAndroid.removeEventListener('hardwareBackPress',this._onHardwareBackPress);
    }
    onHardwareBackPress(e){
        return this.props.backPress(e);
    }
}

