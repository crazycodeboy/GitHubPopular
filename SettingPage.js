/**
* RepositoryDetail
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

var SettingPage=React.createClass({
  render:function() {
    return(
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Text>Action1</Text>
          <Text>Action2</Text>
        </View>
    );
  },
});
module.exports=SettingPage
