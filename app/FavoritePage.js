/**
* FavoritePage
* @flow
**/
'use strict'
var React=require('react');
var ReactNative=require('react-native');
var{
  StyleSheet,
  Text,
  View,
}=ReactNative;

var FavoritePage=React.createClass({
  render:function() {
    return(
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Text>FavoritePage</Text>
          <Text>FavoritePage</Text>
        </View>
    );
  },
});
module.exports=FavoritePage
