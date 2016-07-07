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
    var item=this.props.projectModel.item;
    return(
      <ScrollView style={styles.container}>
        <View >
          <Text>{item.full_name}</Text>
          <Text>{item.description}</Text>
          <Text>{item.stargazers_count}</Text>
          <Text>{item.owner.login}</Text>
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
