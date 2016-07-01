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
      <ScrollView style={styles.container}>
        <View >
          <Text>{this.props.item.name}</Text>
          <Text>{this.props.item.description}</Text>
          <Text>{this.props.item.stargazers_count}</Text>
          <Text>{this.props.item.owner.login}</Text>
        </View>
      </ScrollView>
    );
  },
});
const styles=StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#ffffff'
  },
})
module.exports=RepositoryDetail
