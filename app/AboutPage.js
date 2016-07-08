/**
* AboutPage
* @flow
**/
'use strict'
var React=require('react');
var ReactNative=require('react-native');
var{
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
}=ReactNative;
var NavigationBar=require('./NavigationBar')
var AboutPage=React.createClass({
  render:function() {
    return(
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <NavigationBar
            title='About'
          />
          <Text>About</Text>
          <Text>About</Text>
        </View>
    );
  },
});
module.exports=AboutPage
