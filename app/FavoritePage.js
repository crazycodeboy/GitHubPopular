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
        <View style={styles.container}>
          <Text style={{backgroundColor:'yellow',textAlign: 'center'}}>FavoritePage</Text>
        </View>
    );
  },
});
var styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 64,
},
});
module.exports=FavoritePage
