/**
 * NavigationBar
 * @flow
 */
 import React, { Component } from 'react';

 import {
   StyleSheet,
   Navigator,
   Platform,
   TouchableOpacity,
   Image,
   Text,
   View
 } from 'react-native'
var NavigationBar=React.createClass({
  propTypes: {
    navigator:React.PropTypes.object,
    leftButtonTitle: React.PropTypes.string,
    leftButtonIcon: Image.propTypes.source,
    popEnabled:React.PropTypes.bool,
    onLeftButtonClick: React.PropTypes.func,
    title:React.PropTypes.string,
    rightButtonTitle: React.PropTypes.string,
    rightButtonIcon:Image.propTypes.source,
    onRightButtonClick:React.PropTypes.func
  },
  getDefaultProps() {
    return {
      title: '',
      popEnabled:true
    };
  },

  leftView(){
    // if (!(this.props.leftButtonTitle||this.props.leftButtonIcon)) return;
    var leftButtonTitle=this.props.leftButtonTitle?
      <Text style={styles.title}>{this.props.leftButtonTitle}</Text>:null;
    var leftButtonIcon=this.props.leftButtonIcon?
      <Image
        style={{width:26,height:26}}
        source={this.props.leftButtonIcon}/>:null;

    return(
      <TouchableOpacity
        onPress={this.onLeftButtonClick}>
        <View style={{width: 50, alignItems: 'center',flex:1,justifyContent:'center'}}>
          {leftButtonTitle}
          {leftButtonIcon}
        </View>
      </TouchableOpacity>
    )
  },
  onLeftButtonClick(){
    if (this.props.navigator&&this.props.popEnabled)this.props.navigator.pop();
    if(this.props.onLeftButtonClick)this.props.onLeftButtonClick();
  },
  rightView(){
    var rightButtonTitle=this.props.rightButtonTitle;
    var rightButtonIcon=this.props.rightButtonIcon;
    // if (!(rightButtonTitle||rightButtonIcon)) return;
    var titleView=this.props.rightButtonTitle?
     <Text style={styles.title}>{this.props.rightButtonTitle}</Text>:null;
    return(
      <TouchableOpacity
        onPress={this.onRightButtonClick}>
        <View style={styles.button}>
          {titleView}
          <Image
            style={{width:26,height:26}}
            source={rightButtonIcon}/>
        </View>
      </TouchableOpacity>
    )
  },
  onRightButtonClick(){
    if(this.props.onRightButtonClick)this.props.onRightButtonClick();
  },
  render:function() {
    var stateBar=Platform.OS==='ios'?
      <View style={{height:20}}/>:null;
    return(
      <View style={styles.container}>
        {stateBar}
        <View style={styles.navBar}>
          {this.leftView()}
          <View style={styles.titleLayout}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
          {this.rightView()}
        </View>
      </View>
    )
  }
})
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4caf50',
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
module.exports=NavigationBar
