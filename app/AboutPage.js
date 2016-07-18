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
  Platform,
  Text,
  View,
}=ReactNative;
var NavigationBar=require('./NavigationBar')
var AboutPage=React.createClass({
  render:function() {
    var navigationBar=Platform.OS==="android"?
      <NavigationBar
        leftButtonIcon={require('../res/images/ic_menu_white_24dp.png')}
        onLeftButtonClick={()=>this.props.drawer.openDrawer()}
        title='About'/>:
      <NavigationBar
        title='About'/>;
    return(
        <View style={styles.container}>
          {navigationBar}
          <View style={styles.content}>
            <Text style={{color:'grey',textDecorationLine: 'underline'}}>
              It's a GitHub most popular repositories viewer with React Native.
            </Text>
            <Text style={{color:'dodgerblue'}}>
              This project is open source in GitHub.
            </Text>
            <Text>
              About Me:
            </Text>
            <View style={{flexDirection:'row'}}>
              {/*<Image
                style={{width:56,height:56,}}
                source={{uri:'http://avatar.csdn.net/1/1/E/1_fengyuzhengfan.jpg'}}
              />*/}
              <View style={{flex:1}}>
                <Text>
                  In GitHub:https://git.oschina.net/crazycodeboy/
                </Text>
                <Text>
                  In CSDN:http://blog.csdn.net/fengyuzhengfan/
                </Text>
                <Text>
                  In JianShu:http://www.jianshu.com/users/ca3943a4172a/latest_articles
                </Text>
              </View>
            </View>
          </View>
         </View>
    );
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff'
  },
  content:{
    paddingTop:20,
    paddingLeft:10,
    paddingRight:10
  },
  navBar:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between',
    // backgroundColor: 'red',
    height:44,
    shadowOffset:{
        width: 1,
        height: 0.5,
    },
    shadowColor: '#55ACEE',
    shadowOpacity: 0.8,
  },
  titleLayout:{
    flex:1,alignItems:'center'
  },
  title: {
    fontSize:18, color: '#FFFFFF', fontWeight: '400',
    // backgroundColor:'blue',
  },
  button: {
    width: 50, alignItems: 'center'
    // backgroundColor:'red'
  },
})
module.exports=AboutPage
