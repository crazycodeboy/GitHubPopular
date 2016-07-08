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
  WebView,
  Text,
  View,
}=ReactNative;

var RepositoryDetail=React.createClass({
  render:function() {
    var item=this.props.projectModel.item;
    return(
      // <ScrollView style={styles.container}>
      //   <View >
      //     <Text>{item.full_name}</Text>
      //     <Text>{item.description}</Text>
      //     <Text>{item.stargazers_count}</Text>
      //     <Text>{item.owner.login}</Text>
      //   </View>
      // </ScrollView>
      <WebView
        style={styles.container}
        source={{uri:item.html_url}}
      />
    );
  },
});
const styles=StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#ffffff',
    marginBottom:50
  },
})
module.exports=RepositoryDetail
