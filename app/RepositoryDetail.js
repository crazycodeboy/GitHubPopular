/**
 * RepositoryDetail
 * @flow
 **/
'use strict'
import React, {Component} from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    WebView,
    Platform,
    BackAndroid,
    Text,
    View,
} from 'react-native'
import NavigationBar from './NavigationBar'
import FavoriteDao from './dao/FavoriteDao'
var favoriteDao = new FavoriteDao();
var WEBVIEW_REF = 'webview';

export default class RepositoryDetail extends Component {
    constructor(propos) {
        super(propos);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../res/images/ic_star_border_white_24dp.png') : require('../res/images/ic_star_border_gray_white_24dp.png'),
            url: this.props.projectModel.item.html_url,
            canGoBack: false,
            title: this.props.projectModel.item.full_name
        }
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBackPress);
    }

    componentWillUnmount() {
        if (this.props.parentComponent)this.props.parentComponent.updateFavorite();
        BackAndroid.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
    }

    onHardwareBackPress() {
        this.onLeftButtonClick();
        return true;
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../res/images/ic_star_border_white_24dp.png') : require('../res/images/ic_star_border_gray_white_24dp.png')
        })
    }

    onRightButtonClick() {//favoriteIcon单击回调函数
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        if (projectModel.isFavorite) {
            favoriteDao.saveFavoriteItem(projectModel.item.id.toString(), JSON.stringify(projectModel.item));
        } else {
            favoriteDao.removeFavoriteItem(projectModel.item.id.toString());
        }
    }

    onLeftButtonClick() {
        if (this.state.canGoBack) {
            this.refs[WEBVIEW_REF].goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    navigator={this.props.navigator}
                    leftButtonTitle='Back'
                    popEnabled={false}
                    onLeftButtonClick={()=>this.onLeftButtonClick()}
                    title={this.state.title}
                    rightButtonIcon={this.state.favoriteIcon}
                    onRightButtonClick={()=>this.onRightButtonClick()}
                />
                <WebView
                    ref={WEBVIEW_REF}
                    startInLoadingState={true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}/>
            </View>

        );
    }
}
;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginBottom: Platform.OS === "ios" ? 50 : 0,
    },
})
