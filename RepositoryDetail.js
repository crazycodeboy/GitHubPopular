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

var RepositoryDetail=React.createClass({
  render:function() {
    return(
      <ScrollView >
        <View >
          <Text>{this.props.item.name}</Text>
        </View>
      </ScrollView>
    );
  },
});
module.exports=RepositoryDetail
