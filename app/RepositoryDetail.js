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
var NavigationBar=require('./NavigationBar')
var FavoriteDao=require('./FavoriteDao')
var favoriteDao = new FavoriteDao()
var RepositoryDetail=React.createClass({
  getInitialState(){
    return{
      isFavorite:this.props.projectModel.isFavorite,
      favoriteIcon:this.props.projectModel.isFavorite? require('../res/images/ic_star_border_white_24dp.png'):require('../res/images/ic_star_border_gray_white_24dp.png')
    }
  },
  componentWillUnmount:function(){
    if (this.props.parentComponent)this.props.parentComponent.updateFavorite();
  },
  setFavoriteState(isFavorite:boolean){
    this.setState({
      isFavorite:isFavorite,
      favoriteIcon:isFavorite? require('../res/images/ic_star_border_white_24dp.png'):require('../res/images/ic_star_border_gray_white_24dp.png')
    })
  },
  onRightButtonClick(){//favoriteIcon单击回调函数
    var projectModel=this.props.projectModel;
    this.setFavoriteState(projectModel.isFavorite=!projectModel.isFavorite);
    if(projectModel.isFavorite){
      favoriteDao.saveFavoriteItem(projectModel.item.id.toString(),JSON.stringify(projectModel.item));
    }else {
      favoriteDao.removeFavoriteItem(projectModel.item.id.toString());
    }
  },
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
      <View style={styles.container}>
        <NavigationBar
          navigator={this.props.navigator}
          backButtonTitle='Back'
          title={item.full_name}
          rightButtonIcon={this.state.favoriteIcon}
          onRightButtonClick={this.onRightButtonClick}
        />
        <WebView
          source={{uri:item.html_url}}/>
      </View>

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
