/**
 * FavoritePage
 * @flow
 */
'use strict';
var React = require('react')
var ReactNative = require('react-native')
var {
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  RefreshControl,
  Text,
  View,
} = ReactNative;
var RepositoryCell=require('./RepositoryCell')
var dismissKeyboard=require('dismissKeyboard')
var RepositoryDetail=require('./RepositoryDetail')
var FavoriteDao=require('./dao/FavoriteDao')
var ProjectModel=require('./model/ProjectModel')
var NavigationBar=require('./NavigationBar')
// var API_URL ='https://api.github.com/search/repositories?q=ios&sort=stars';
var API_URL ='https://api.github.com/search/repositories?q=stars:>1&sort=stars'
var favoriteDao = new FavoriteDao()
var FavoritePage=React.createClass({
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
    this.loadData(true);
  },
  componentWillReceiveProps:function(nextProps:Object) {//当从当前页面切换走，再切换回来后
    this.loadData(false);
  },
  loadData:function(isShowLoading:boolean){
    if(isShowLoading)
      this.setState({
        isLoading:true,
        isLodingFail:false,
      });
    favoriteDao.getAllItems().then((items)=>{
      var resultData=[];
      for(var i=0,len=items.length;i<len;i++){
        resultData.push(new ProjectModel(items[i],true));
      }
      this.setState({
        isLoading:false,
        isLodingFail:false,
        dataSource:this.getDataSource(resultData),
      });
    }).catch((error)=>{
      this.setState({
        isLoading:false,
        isLodingFail:true,
      });
    });
  },
  onRefresh :function() {
    this.loadData(true);
  },
  getDataSource:function(items:Array<any>):ListView.DataSource{
    return this.state.dataSource.cloneWithRows(items);
  },
  onSelectRepository:function(projectModel:Object) {
    var belongNavigator=this.props.navigator;
    var item=projectModel.item;
    belongNavigator.push({
      title:item.full_name,
      component:RepositoryDetail,
      params:{
        projectModel:projectModel,
      },
    });
  },
  onFavorite(item:Object,isFavorite:boolean){
    if(isFavorite){
      favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
    }else {
      favoriteDao.removeFavoriteItem(item.id.toString());
    }
  },
  renderRow:function(
    projectModel:Object,
    sectionID:number|string,
    rowID:number|string,
  ){
    return(
      <RepositoryCell
        key={projectModel.item.id}
        onFavorite={this.onFavorite}
        isFavorite={true}
        onSelect={()=>this.onSelectRepository(projectModel)}
        projectModel={projectModel}/>
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
      style={styles.listView}
      renderRow={this.renderRow}
      enableEmptySections={true}
      //renderSeparator={this.renderSeparator}
      dataSource={this.state.dataSource}
      refreshControl={
         <RefreshControl
          //style={{paddingTop:64}}
           refreshing={this.state.isLoading}
           onRefresh={()=>this.onRefresh()}
           tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
         />}
      />;
    var navigationBar=Platform.OS==="android"?
      <NavigationBar
        leftButtonIcon={require('../res/images/ic_menu_white_24dp.png')}
        onLeftButtonClick={()=>this.props.drawer.openDrawer()}
        title='Favorite'/>:
        <NavigationBar
          title='Favorite'/>;
    return (
        <View style={styles.container} >
          {navigationBar}
          {content}
        </View>
    );
  }
});
var styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'stretch',
    // backgroundColor:'red'
  },
  listView:{
    marginTop:Platform.OS==="ios"?-20:0,
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
module.exports=FavoritePage;
