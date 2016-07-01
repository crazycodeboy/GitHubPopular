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
  Platform,
  TouchableOpacity,
  Text,
  TabBarIOS,
  View
} from 'react-native';
// import Drawer from 'react-native-drawer'
var DrawerLayout = require('react-native-drawer-layout')
var AboutPage=require('./app/AboutPage')
var PopularPage=require('./app/PopularPage')
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
  _renderScene(route, navigator) {
    let Component = route.component;
    return (
      <Component {...route.params} navigator={navigator} />
    );
  },
  _renderNavBar(defaultTitle) {
    var routeMapper = {
      LeftButton(route, navigator, index, navState) {
        if(index > 0) {
          return (
            <TouchableOpacity
              onPress={() => navigator.pop()}
              style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          );
        } else {
          return null
          // (
          //   <TouchableOpacity
          //     onPress={() => navigator.pop()}
          //     style={styles.button}>
          //     <Text style={styles.buttonText}>Logo</Text>
          //   </TouchableOpacity>
          // );
        }
      },
      RightButton(route, navigator, index, navState) {
        if(index > 0 && route.rightButton) {
          return (
            <TouchableOpacity
              onPress={() => navigator.pop()}
              style={styles.button}>
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>
          );
        } else {
          return null
        }

      },
      Title(route, navigator, index, navState) {
        return (
          <View style={styles.title}>
            <Text style={styles.buttonText}>{route.title ? route.title : defaultTitle}</Text>
          </View>
        );
      }
    };
    return (
      <Navigator.NavigationBar
        style={styles.navBar}
        routeMapper={routeMapper}
      />
    );
  },
  _navigator(defaultComponent,defaultName){
    return (
      <Navigator
        ref="nav"
        style={styles.container}
        initialRoute={{
          name: 'Popular',
          component:defaultComponent
        }}
        renderScene={this._renderScene}
        sceneStyle={{paddingTop: (Platform.OS === 'android' ? 66 : 64)}}
        navigationBar={this._renderNavBar(defaultName)}
      />
    )

  },
  _tbItem(title,icon,selectedTab,navigator){
    return(
      <TabBarIOS.Item
        title={title}
        icon={icon}
        selectedIcon={icon}
        selected={this.state.selectedTab === selectedTab}
        onPress={()=>this.onSelected(selectedTab)}
        >
        {navigator}
      </TabBarIOS.Item>
    )
  },
  render:function() {
    return (
      <TabBarIOS
        tintColor="#4caf50"
        unselectedTintColor="lightslategray"
        barTintColor="ghostwhite">
        {this._tbItem('Popular', require('./res/images/ic_whatshot_black_36dp.png'), 'popularTab', this._navigator(PopularPage,'Popular'))}
        {this._tbItem('Favorite', require('./res/images/ic_favorite_black_36dp.png'), 'favoriteTab', this._navigator(FavoritePage,'Favorite'))}
        {this._tbItem('About', require('./res/images/ic_hdr_weak_black_36dp.png'), 'aboutTab', this._navigator(AboutPage,'About'))}
      </TabBarIOS>
    );
  }
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  navBar:{
    alignItems: 'center',
    backgroundColor: '#4caf50',
    shadowOffset:{
        width: 1,
        height: 0.5,
    },
    shadowColor: '#55ACEE',
    shadowOpacity: 0.8,
  },
  text:{
    height:100,
    backgroundColor:'yellow',
  },
  title: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  button: {
    flex: 1, width: 50, alignItems: 'center', justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18, color: '#FFFFFF', fontWeight: '400'
  }
})

AppRegistry.registerComponent('MostPopularInGitHub', () => MostPopularInGitHub);
