/**
 * GitHubPopular
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  DrawerLayoutAndroid,
  Navigator,
  Platform,
  TouchableOpacity,
  ToolbarAndroid,
  Text,
  TabBarIOS,
  View
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view'
var AboutPage=require('./app/AboutPage')
var PopularPage=require('./app/PopularPage')
var FavoritePage=require('./app/FavoritePage')
var NavigationBar=require('./app/NavigationBar')
var MenuItem = require('./app/ui/MenuItem');
var updateFavorite;
var GitHubPopular=React.createClass({
 getInitialState: function() {
   return {
     selectedTab: 'popularTab',
   };
 },
 componentDidMount:function(){
   console.log('');
 },

 onSelected:function(object:string) {
  if(this.updateFavorite&&'popularTab'===object)this.updateFavorite(object);
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
  _navigator(defaultComponent,defaultName){
    return (
      <Navigator
        ref={'nav'+defaultName}
        style={styles.container}
        initialRoute={{
          name: 'Popular',
          component:defaultComponent
        }}
        renderScene={this._renderScene}
        //sceneStyle={{paddingTop: (Platform.OS === 'android' ? 66 : 64)}}
        //navigationBar={this._renderNavBar(defaultName)}
      />
    )
  },
  _popularNavigator(){
    var component=
      <View style={{flex:1}}>
        <NavigationBar
          leftButtonIcon={require('./res/images/ic_menu_white_24dp.png')}
          onLeftButtonClick={()=>this.refs.drawer.openDrawer()}
          title='Popular'/>
        <ScrollableTabView
          //style={{paddingBottom:50}}
          tabBarUnderlineColor='#4caf50'
          tabBarInactiveTextColor='gray'
          tabBarActiveTextColor='#4caf50'
          ref="scrollableTabView"
          initialPage={0}
          renderTabBar={() => <ScrollableTabBar underlineHeight={2}/>}
          >
          <PopularPage tabLabel='ALL' homeComponent={this}/>
          <PopularPage tabLabel='iOS' homeComponent={this}/>
          <PopularPage tabLabel='Android' homeComponent={this}/>
          <PopularPage tabLabel='JavaScript' homeComponent={this}/>
          <PopularPage tabLabel='Java' homeComponent={this}/>
          <PopularPage tabLabel='Go' homeComponent={this}/>
          <PopularPage tabLabel='CSS' homeComponent={this}/>
          <PopularPage tabLabel='Object-c' homeComponent={this}/>
          <PopularPage tabLabel='Python' homeComponent={this}/>
          <PopularPage tabLabel='Swift' homeComponent={this}/>
          <PopularPage tabLabel='HTML' homeComponent={this}/>
        </ScrollableTabView>
      </View>
    return this._navigator(()=>component, 'Popular');
  },
  onTabSelect(tab: Tab) {
    // if (this.state.selectedTab !== tab) {
    //   this.props.onTabSelect(tab);
    // }
    this.setState({
      selectedTab:tab
    });
    this.refs.drawer.closeDrawer();
  },
  renderNavigationView() {
    return(
      <View style={styles.drawer}>
        <MenuItem
          title="Popular"
          selected={this.props.tab==='popularTab'}
          onPress={this.onTabSelect.bind(this, 'popularTab')}
          icon={require('./res/images/ic_whatshot_black_36dp.png')}
          //selectedIcon={}
        />
        <MenuItem
          title="Favorite"
          selected={this.props.tab==='favoriteTab'}
          onPress={this.onTabSelect.bind(this, 'favoriteTab')}
          icon={require('./res/images/ic_favorite_black_36dp.png')}
          //selectedIcon={}
        />
        <MenuItem
          title="About"
          selected={this.props.tab==='aboutTab'}
          onPress={this.onTabSelect.bind(this, 'aboutTab')}
          icon={require('./res/images/ic_hdr_weak_black_36dp.png')}
          //selectedIcon={}
        />
      </View>
    );
  },
  renderContent() {
    switch (this.state.selectedTab) {
      case 'popularTab':
        return this._popularNavigator();
        // return <FavoritePage/>;

      case 'favoriteTab':
        return this._navigator(()=><FavoritePage drawer={this.refs.drawer}/>,'Favorite');
        // return <FavoritePage/>;
      case 'aboutTab':
        return this._navigator(()=><AboutPage drawer={this.refs.drawer}/>,'About');
        // return <FavoritePage/>;
    }
    throw new Error(`Unknown tab ${this.state.selectedTab}`);
  },
  render:function() {
    return (
      <DrawerLayoutAndroid
        ref='drawer'
        drawerWidth={260}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.renderNavigationView}>
        <View style={styles.content} key={this.state.selectedTab}>
          {this.renderContent()}
        </View>
      </DrawerLayoutAndroid>
    );
  }
})
const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  name: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },

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

AppRegistry.registerComponent('GitHubPopular', () => GitHubPopular);
