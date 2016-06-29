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
  Navigator,
  Text,
  TabBarIOS,
  View
} from 'react-native';
// import Drawer from 'react-native-drawer'
var DrawerLayout = require('react-native-drawer-layout')
var AboutPage=require('./app/AboutPage')
var MostPopular=require('./app/MostPopular')
var FavoritePage=require('./app/FavoritePage')
var MostPopularInGitHub=React.createClass({
 getInitialState: function() {
   return {
     selectedTab: 'favoriteTab',
   };
 },
  onSelected:function(object:string) {
    this.setState({
      selectedTab:object,
    })
  },
  render:function() {
    var popularTab=
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        initialRoute={{
          title:`MostPopular`,
          component:MostPopular,
        }}/>;
    return (
      <TabBarIOS
        tintColor="blue"
        unselectedTintColor="lightslategray"
        barTintColor="ghostwhite">
        <TabBarIOS.Item
          title="Popular"
          systemIcon="top-rated"
          selected={this.state.selectedTab === 'popularTab'}
          onPress={()=>this.onSelected('popularTab')}
          >
          {popularTab}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Favorite"
          systemIcon="favorites"
          selected={this.state.selectedTab === 'favoriteTab'}
          onPress={()=>this.onSelected('favoriteTab')}
          >
          <FavoritePage/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          renderAsOriginal
          title="About"
          systemIcon="bookmarks"
          selected={this.state.selectedTab === 'aboutTab'}
          onPress={()=>this.onSelected('aboutTab')}
          >
          <AboutPage/>
        </TabBarIOS.Item>
        </TabBarIOS>

      );
    }
  })


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  text:{
    height:100,
    backgroundColor:'yellow',
  }
})

AppRegistry.registerComponent('MostPopularInGitHub', () => MostPopularInGitHub);
