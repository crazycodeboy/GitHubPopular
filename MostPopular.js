/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  RefreshControl,
  Text,
  View,
} = ReactNative;
var RepositoryCell=require('./RepositoryCell');
var dismissKeyboard=require('dismissKeyboard');
var RepositoryDetail=require('./RepositoryDetail')
// var API_URL ='https://api.github.com/search/repositories?q=ios&sort=stars';
var API_URL ='https://api.github.com/search/repositories?q=stars:>1&sort=stars';
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
        isLoading:false,
        isLodingFail:false,
        dataSource:this.getDataSource(responseData.items),
      });
    })
    .done();
  },
  onRefresh :function() {
    this.loadData();
  },
  getDataSource:function(items:Array<any>):ListView.DataSource{
    return this.state.dataSource.cloneWithRows(items);
  },
  onSelectRepository:function(item:Object) {
    if (Platform.OS==='ios') {
      this.props.navigator.push({
        title:item.name,
        component:RepositoryDetail,
        passProps:{item},
      });
    }else {
      dismissKeyboard();
      this.props.navigator.push({
        title:item.name,
        name:'item',
        item:item,
      });
    }
  },
  renderRow:function(
    item:Object,
    sectionID:number|string,
    rowID:number|string,
  ){
    return(
      <RepositoryCell
        key={item.id}
        onSelect={()=>this.onSelectRepository(item)}
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
      dataSource={this.state.dataSource}
      refreshControl={
         <RefreshControl
           refreshing={this.state.isLoading}
           onRefresh={()=>this.onRefresh()}
         />}
      />;
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }
});
var styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'stretch',
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
