/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View
} from 'react-native';
var ReactNative = require('react-native');
var ItemCell=require('./ItemCell');


var API_URL ='https://api.github.com/search/repositories?q=javascript&sort=stars';
var resultData=[];
var MostPopular=React.createClass({
  getInitialState: function(){
    return{
      isLoading:false,
      isLodingFail:false,
      dataSource:new ListView.DataSource({
        rowHasChanged:(row1,row2)=>row1!==row2,
      }),
      filter:'',
    };
  },
  componentDidMount:function(){
    this.loadData();
  },
  loadData:function(){
    this.setState({
      isLoading:true,
      isLodingFail:false,
    });
    fetch(API_URL).then((response)=>response.json())
    .catch((error)=>{
      this.setState({
        isLoading:false,
        isLodingFail:true,
      });
    }).then((responseData)=>{
      resultData=responseData.items;
      this.setState({
        isLoading:true,
        isLodingFail:false,
        dataSource:this.getDataSource(responseData.items),
      });
    })
    .done();
  },
  getDataSource:function(items:Array<any>):ListView.DataSource{
    return this.state.dataSource.cloneWithRows(items);
  },
  renderRow:function(
    item:Object,
    sectionID:number|string,
    rowID:number|string,
  ){
    return(
      <ItemCell
        key={item.id}
        item={item}/>
    );
  },
  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },

  render() {
    var content=
    <ListView
      ref="listView"
      renderRow={this.renderRow}
      renderSeparator={this.renderSeparator}
      dataSource={this.state.dataSource}/>;
    return (
      <View style={styles.container}>
        <Text>-----start------</Text>
        {content}
        <Text>------end-------</Text>
      </View>
    );
  }
});
var styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'stretch',
    backgroundColor: 'yellow',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
});
module.exports=MostPopular;
