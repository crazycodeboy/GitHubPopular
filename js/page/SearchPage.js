/**
 * SearchPage
 * @flow
 * **/

'use strict';
import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    TouchableHighlight,
    ListView,
} from "react-native";

import Toast, {DURATION} from 'react-native-easy-toast'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryCell from '../common/RepositoryCell'
import BaseCommon from '../common/BaseCommon'
import RepositoryDetail from './RepositoryDetail'
import {FLAG_TAB} from './HomePage'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import Utils from '../util/Utils'
import ViewUtils from '../util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'
import makeCancelable from '../util/Cancelable'
import ProjectModel from '../model/ProjectModel'
const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.baseCommon=new BaseCommon({...props,backPress:(e)=>this.onBackPress(e)});
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.favoritKeys = [];
        this.state = {
            inputKey: '',
            isLoading: false,
            showBottomButton: false,
            rightButtonText: 'Go',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
        };
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
        this.initKeys();
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
        if (this.isKeyChange)this.props.homeComponent.onReStart(FLAG_TAB.flag_popularTab);
    }
    onBackPress(e){
        this.refs.input.blur();
        this.props.navigator.pop();
        return true;
    }
    async initKeys() {
        this.keys = await this.languageDao.fetch();
    }

    onSelectRepository(projectModel) {
        var item = projectModel.item;
        this.props.navigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                parentComponent: this,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            },
        });
    }

    onFavorite(item, isFavorite) {//favoriteIcon单击回调函数
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    saveKey() {
        let key = this.state.inputKey;
        if (this.checkKeyIsExist(this.keys, key)) {
            this.refs.toast.show(this.state.inputKey + ' already exists.', DURATION.LENGTH_SHORT)
        } else {
            key = {
                "path": key,
                "name": key,
                "checked": true
            };
            this.keys.unshift(key);
            this.languageDao.save(this.keys)
            this.refs.toast.show(this.state.inputKey + ' saved successfully.', DURATION.LENGTH_SHORT);
            this.isKeyChange = true;
        }
    }

    checkKeyIsExist(keys, key) {
        for (let i = 0, l = keys.length; i < l; i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase())return true;
        }
        return false;
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === 'Go') {
            this.updateState({rightButtonText: 'Cancel'});
            this.loadData();
        } else {
            this.updateState({
                rightButtonText: 'Go',
                isLoading: false,
            });
            this.cancelable.cancel();
        }
    }

    loadData() {
        this.updateState({
            isLoading: true,
            showBottomButton: false,
        });
        this.cancelable = makeCancelable(fetch(this.genFetchUrl(this.state.inputKey)));
        this.cancelable.promise
            .then((response)=>response.json())
            .then((responseData)=> {
                if (!this || !responseData || !responseData.items || responseData.items.length === 0) {
                    this.refs.toast.show(this.state.inputKey + ' nothing found.', DURATION.LENGTH_SHORT);
                    this.updateState({isLoading: false, rightButtonText: 'Go',});
                    return;
                }
                this.items = responseData.items;
                this.getFavoriteKeys();
                if (!this.checkKeyIsExist(this.keys, this.state.inputKey)) {
                    this.updateState({showBottomButton: true,})
                }
            })
            .catch((error)=> {
                this.updateState({
                    isLoading: false,
                    rightButtonText: 'Go',
                });
            });
    }

    updateFavorite() {
        this.getFavoriteKeys();
    }

    getFavoriteKeys() {//获取本地用户收藏的ProjectItem
        this.favoriteDao.getFavoriteKeys().then((keys)=> {
            this.favoritKeys = keys || [];
            this.flushFavoriteState();
        }).catch((error)=> {
            this.flushFavoriteState();
            console.log(error);
        });
    }

    flushFavoriteState() {//更新ProjectItem的Favorite状态
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoritKeys)));
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
            rightButtonText: 'Go',
        });
    }

    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }

    genFetchUrl(category) {
        return API_URL + category + QUERY_STR;
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    renderRow(projectModel, sectionID, rowID) {
        return (
            <RepositoryCell
                key={projectModel.item.id}
                onSelect={()=>this.onSelectRepository(projectModel)}
                theme={this.props.theme}
                projectModel={projectModel}
                onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}/>
        );
    }

    renderNavBar() {
        let backButton =ViewUtils.getLeftButton(()=>this.onBackPress());

        let inputView =
            <TextInput
                ref="input"
                style={styles.textInput}
                autoFocus={true}
                underlineColorAndroid="white"
                placeholder="Search repos"
                placeholderTextColor="white"
                clearTextOnFocus={true}
                clearButtonMode="while-editing"
                onChangeText={(inputKey) => this.setState({inputKey})}
            ></TextInput>;
        let rightButton =
            <TouchableOpacity
                onPress={()=> {
                    this.refs.input.blur();
                    this.onRightButtonClick();
                }}
            >
                <View style={{alignItems: 'center', marginRight: 10}}>
                    <Text style={styles.title}>{this.state.rightButtonText}</Text>
                </View>
            </TouchableOpacity>;
        return (
            <View style={{
                backgroundColor: this.props.theme.themeColor,
                height: Platform.OS==='ios'? GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {backButton}
                {inputView}
                {rightButton}
            </View>
        )
    }

    render() {
        let statusBar = null;

        if (Platform.OS === 'ios') {
            statusBar =
                <View style={[styles.statusBar, {backgroundColor: this.props.theme.themeColor}]}/>;
        }
        let indicatorView = this.state.isLoading ?
            <ActivityIndicator
                animating={this.state.isLoading}
                style={[styles.centering,]}
                size="large"
            /> : null;
        let listView = !this.state.isLoading ?
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e)=>this.renderRow(e)}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
            /> : null;
        let resultView =
            <View style={{flex: 1}}>
                {indicatorView}
                {listView}
            </View>
        let bottomButton = this.state.showBottomButton ?
            <TouchableOpacity
                underlayColor="transparent"
                style={[styles.bottomButton, {backgroundColor: this.props.theme.themeColor}]}
                onPress={()=> {
                    this.saveKey();
                }}
            >
                <View style={{justifyContent: 'center',}}>
                    <Text style={styles.title}>Add Key {this.state.inputKey} </Text>
                </View>
            </TouchableOpacity>
            : null;
        return (
            <View style={[GlobalStyles.listView_container,]}>
                {statusBar}
                {this.renderNavBar()}
                {resultView}
                {bottomButton}
                <Toast ref="toast" position='bottom'/>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    statusBar: {
        height: 20,
    },
    title: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ?30:40,
        borderWidth: 1,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 3,
        opacity: 0.7,
        color:'white'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        flex: 1,
    },
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        top: GlobalStyles.window_height-45-(Platform.OS === 'ios' ? 0:25),
        right: 10,
        bottom: 0,
        alignSelf: 'flex-end',
        borderRadius: 3,

    },
})