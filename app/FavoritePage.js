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
var FavoriteDao=require('./FavoriteDao')
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
      this.setState({
        isLoading:false,
        isLodingFail:false,
        dataSource:this.getDataSource(items),
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
  onSelectRepository:function(item:Object) {
    if (Platform.OS==='ios') {
      this.props.navigator.push({
        title:item.name,
        component:RepositoryDetail,
        params:{
          item:item,
        },
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
  onFavorite(item:Object,isFavorite:boolean){
    if(isFavorite){
      favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
    }else {
      favoriteDao.removeFavoriteItem(item.id.toString());
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
        onFavorite={this.onFavorite}
        isFavorite={true}
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
    return (
        <View style={styles.container} >
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
    marginTop:-20,
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
