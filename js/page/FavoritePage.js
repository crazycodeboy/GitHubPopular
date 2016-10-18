/**
 * FavoritePage
 * @flow
 */
'use strict';
import React, {Component} from 'react'
import {
    ListView,
    Platform,
    StyleSheet,
    TouchableHighlight,
    Image,
    RefreshControl,
    View,
} from 'react-native'

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import ViewUtils from '../util/ViewUtils'
import RepositoryCell from '../common/RepositoryCell'
import TrendingRepoCell from '../common/TrendingRepoCell'
import RepositoryDetail from './RepositoryDetail'
import MoreMenu,{MORE_MENU} from '../common/MoreMenu'
import {FLAG_TAB} from './HomePage'
import CustomTheme from "./my/CustomTheme"
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import NavigationBar from '../common/NavigationBar'
import {FLAG_STORAGE} from '../expand/dao/RepositoryDao'
import ArrayUtils from '../util/ArrayUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'

export default class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme:this.props.theme,
            customThemeViewVisible:false,
        }
    }
    componentDidMount() {
        this.props.homeComponent.addSubscriber(this.onSubscriber);
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubscriber(this.onSubscriber);
    }
    onSubscriber = (preTab, currentTab)=> {
        var changedValues = this.props.homeComponent.changedValues;
        if(changedValues.my.themeChange&&preTab.styles) {
            this.setState({
                theme:preTab
            })
            return;
        }
    }
    renderMoreView() {
        let params = {...this.props, theme: this.state.theme,fromPage:FLAG_TAB.flag_favoriteTab}
        return <MoreMenu
            {...params}
            ref="moreMenu"
            menus={[MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About]}
            contentStyle={{right:20}}
            onMoreMenuSelect={(e)=>{
                if(e==='Custom Theme'){
                    this.setState({customThemeViewVisible: true});
                }
            }}
            anchorView={this}
            navigator={this.props.navigator} />
    }
    render() {
        let content =
            <ScrollableTabView
                tabBarUnderlineColor='#e7e7e7'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarBackgroundColor={this.state.theme.themeColor}
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40,borderWidth:0,elevation:2}} tabStyle={{height: 39}}
                                                      underlineHeight={2}/>}
            >
                <FavoriteTab {...this.props} tabLabel='Popular' flag={FLAG_STORAGE.flag_popular} theme={this.state.theme}/>
                <FavoriteTab {...this.props} tabLabel='Trending' flag={FLAG_STORAGE.flag_trending} theme={this.state.theme}/>
            </ScrollableTabView>
        let navigationBar =
            <NavigationBar
                style={this.state.theme.styles.navBar}
                rightButton={ViewUtils.getMoreButton(()=>this.refs.moreMenu.open())}
                title='Favorite'/>;
        let customThemeView=
            <CustomTheme
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={()=>{this.setState({customThemeViewVisible:false})}}/>
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {customThemeView}
                {this.renderMoreView()}
            </View>
        );
    }

}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.unFavoriteItems=[];
        this.state = {
            isLoading: false,
            isLodingFail: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            filter: ''
        };
    }

    componentDidMount() {
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.loadData(true);
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.loadData(false);
    }

    loadData(isShowLoading) {
        if (isShowLoading)
            this.setState({
                isLoading: true,
                isLodingFail: false,
            });
        this.favoriteDao.getAllItems().then((items)=> {
            var resultData = [];
            for (var i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            this.setState({
                isLoading: false,
                isLodingFail: false,
                dataSource: this.getDataSource(resultData),
            });
        }).catch((error)=> {
            this.setState({
                isLoading: false,
                isLodingFail: true,
            });
        });
    }

    onRefresh() {
        this.loadData(true);
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    onSelectRepository(projectModel) {
        var belongNavigator = this.props.navigator ? this.props.navigator : this.props.homeComponent.refs.navFavorite;
        var item = projectModel.item;
        belongNavigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                flag:this.props.flag,
                ...this.props
            },
        });
    }

    onFavorite(item, isFavorite) {
        var key=this.props.flag===FLAG_STORAGE.flag_popular? item.id.toString():item.fullName;
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
        ArrayUtils.updateArray(this.unFavoriteItems,item);
        if(this.unFavoriteItems.length>0){
            if (this.props.flag===FLAG_STORAGE.flag_popular){
                this.props.homeComponent.changedValues.favorite.popularChange=true;
            }else {
                this.props.homeComponent.changedValues.favorite.trendingChange=true;
            }
        }else {
            if (this.props.flag===FLAG_STORAGE.flag_popular){
                this.props.homeComponent.changedValues.favorite.popularChange=false;
            }else {
                this.props.homeComponent.changedValues.favorite.trendingChange=false;
            }
        }
    }

    renderRow(projectModel, sectionID, rowID) {
        let CellComponent=this.props.flag===FLAG_STORAGE.flag_popular? RepositoryCell:TrendingRepoCell;
        let {navigator}=this.props;
        return (
            <CellComponent
                key={this.props.flag===FLAG_STORAGE.flag_popular? projectModel.item.id:projectModel.item.fullName}
                onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}
                isFavorite={true}
                {...{navigator}}
                theme={this.props.theme}
                onSelect={()=>this.onSelectRepository(projectModel)}
                projectModel={projectModel}/>
        );
    }
    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e)=>this.renderRow(e)}
                renderFooter={()=>{return <View style={{height:50}}/>}}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.onRefresh()}
                        tintColor={this.props.theme.themeColor}
                        title="Loading..."
                        titleColor={this.props.theme.themeColor}
                        colors={[this.props.theme.themeColor, this.props.theme.themeColor, this.props.theme.themeColor]}
                    />}
            />;
        return (
            <View style={GlobalStyles.listView_container}>
                {content}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        // backgroundColor:'red'
    },
    listView: {
        // marginTop: Platform.OS === "ios" ? 0 : 0,
    },
    separator: {
        height: 1,
        backgroundColor: '#eeeeee',
    },
});
