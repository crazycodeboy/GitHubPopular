/**
 * MostPopular
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Text,
  View
} from 'react-native';
var MostPopular=require('./MostPopular');
var MostPopularInGitHub=React.createClass({
  render:function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title:`MostPopular`,
          component:MostPopular,
        }}/>

    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('MostPopularInGitHub', () => MostPopularInGitHub);
