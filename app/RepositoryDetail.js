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
  Platform,
  Text,
  View,
}=ReactNative;
var NavigationBar=require('./NavigationBar');
var FavoriteDao=require('./dao/FavoriteDao');
var favoriteDao = new FavoriteDao();
var WEBVIEW_REF = 'webview';
var RepositoryDetail=React.createClass({
  getInitialState(){
    return{
      isFavorite:this.props.projectModel.isFavorite,
      favoriteIcon:this.props.projectModel.isFavorite? require('../res/images/ic_star_border_white_24dp.png'):require('../res/images/ic_star_border_gray_white_24dp.png'),
      url:this.props.projectModel.item.html_url,
      canGoBack:false,
      title:this.props.projectModel.item.full_name
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
  onBackButtonClick(){
    if(this.state.canGoBack){
      this.refs[WEBVIEW_REF].goBack();
    }else {
      this.props.navigator.pop();
    }
  },
  onNavigationStateChange(navState:Object) {
    this.setState({
       canGoBack: navState.canGoBack,
       url: navState.url,
      //  title: navState.title,
      //  loading: navState.loading,
      //  scalesPageToFit: true
    });
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
          popEnabled={false}
          onBackButtonClick={this.onBackButtonClick}
          title={this.state.title}
          rightButtonIcon={this.state.favoriteIcon}
          onRightButtonClick={this.onRightButtonClick}
        />
        <WebView
          ref={WEBVIEW_REF}
          startInLoadingState={true}
          onNavigationStateChange={this.onNavigationStateChange}
          source={{uri:this.state.url}}/>
      </View>

    );
  },
});
const styles=StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#ffffff',
    marginBottom:Platform.OS==="ios"?50:0,
  },
})
module.exports=RepositoryDetail
