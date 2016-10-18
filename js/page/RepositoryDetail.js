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
    TouchableOpacity,
    Text,
    View,
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import BaseCommon from '../common/BaseCommon'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ViewUtils from '../util/ViewUtils'
const TRENDING_URL = 'https://github.com/'
var WEBVIEW_REF = 'webview';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.baseCommon=new BaseCommon({...props,backPress:(e)=>this.onBackPress(e)});
        var url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url
            : TRENDING_URL + this.props.projectModel.item.fullName;
        var title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name
            : this.props.projectModel.item.fullName;
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png'),
            url: url,
            canGoBack: false,
            title: title,
            theme: this.props.theme
        }
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
        this.favoriteDao = new FavoriteDao(this.props.flag);
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
        if (this.props.parentComponent)this.props.parentComponent.updateFavorite();
    }

    onBackPress(e){
        this.onBack();
        return true;
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        })
    }

    onRightButtonClick() {//favoriteIcon单击回调函数
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        var key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    onBack() {
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

    renderRightButton() {
        return <TouchableOpacity
            onPress={()=>this.onRightButtonClick()}>
            <Image
                style={{width: 20, height: 20,marginRight:10}}
                source={this.state.favoriteIcon}/>
        </TouchableOpacity>
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    navigator={this.props.navigator}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                    popEnabled={false}
                    style={this.state.theme.styles.navBar}
                    title={this.state.title}
                    rightButton={this.renderRightButton()}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        // marginBottom: Platform.OS === "ios" ? 50 : 0,
    },
})
