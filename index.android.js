/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View
} from 'react-native';
var MostPopular=require('./MostPopular.js');
class MostPopularInGitHub extends Component {
  render() {
    return (
      // <View style={styles.container}>
        <MostPopular />
      // </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  centerText:{
    alignItems:'center'
  },
  noItemsText:{
    marginTop:80,
    color:'#888888',
  }
});

AppRegistry.registerComponent('MostPopularInGitHub', () => MostPopularInGitHub);
