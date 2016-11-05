/**
 * TrendingPage
 * @flow
 */
'use strict';
import React, {Component} from "react";
import {
    ListView,
    StyleSheet,
    RefreshControl,
    View,
    TouchableHighlight,
    Text,
    Image
} from "react-native";
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import Popover from "../common/Popover";
import MoreMenu,{MORE_MENU} from '../common/MoreMenu'
import TrendingRepoCell from "../common/TrendingRepoCell";
import RepositoryDetail from "./RepositoryDetail";
import FavoriteDao from "../expand/dao/FavoriteDao";
import CustomTheme from "./my/CustomTheme"
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ProjectModel from "../model/ProjectModel";
import TimeSpan from '../model/TimeSpan'
import LanguageDao, {FLAG_LANGUAGE}  from '../expand/dao/LanguageDao'
import {FLAG_TAB} from './HomePage'
import GlobalStyles from '../../res/styles/GlobalStyles'

const API_URL = 'https://github.com/trending/'
var projectModels = [];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
var dataRepository=new DataRepository(FLAG_STORAGE.flag_trending)
var timeSpanTextArray = [new TimeSpan('Today', 'since=daily'),
new TimeSpan('This Week', 'since=weekly'), new TimeSpan('This Month', 'since=monthly')]

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
            languages: [],
            customThemeViewVisible:false,
            theme: this.props.theme
        };
    }

    componentDidMount() {
        this.props.homeComponent.addSubscriber(this.onSubscriber);
        this.loadLanguage();
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubscriber(this.onSubscriber);
    }

    onSubscriber = (preTab, currentTab)=> {
        var changedValues = this.props.homeComponent.changedValues;
        if (changedValues.my.themeChange && preTab.styles) {
            this.setState({
                theme: preTab
            })
            return;
        }
        if (currentTab != FLAG_TAB.flag_trendingTab)return;
        if (FLAG_TAB.flag_trendingTab === currentTab && changedValues.my.languageChange) {//从设置页面切换过来
            this.props.homeComponent.onReStart(FLAG_TAB.flag_trendingTab);
        }
    }
    renderMoreView() {
        let params = {...this.props, theme: this.state.theme,fromPage:FLAG_TAB.flag_trendingTab}
        return <MoreMenu
            {...params}
            ref="moreMenu"
            menus={[MORE_MENU.Sort_Language,MORE_MENU.Custom_Language,MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About]}
            contentStyle={{right:20}}
            onMoreMenuSelect={(e)=>{
                if(e==='Custom Theme'){
                    this.setState({customThemeViewVisible: true});
                }
            }}
            anchorView={this.refs.moreMenuButton}
            navigator={this.props.navigator} />
    }
    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({isVisible: false});
    }

    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }

    loadLanguage() {
        this.languageDao.fetch().then((languages)=> {
            if (languages) {
                this.setState({
                    languages: languages,
                });
            }
        }).catch((error)=> {

        });
    }

    renderTitleView() {
        return <View >
            <TouchableHighlight
                ref='button'
                underlayColor='transparent'
                onPress={()=>this.showPopover()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>Trending {this.state.timeSpan.showText}</Text>
                    <Image
                        style={{width: 12, height: 12, marginLeft: 5}}
                        source={require('../../res/images/ic_spinner_triangle.png')}
                    />
                </View>
            </TouchableHighlight>
        </View>
    }

    render() {
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarUnderlineColor='#e7e7e7'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarBackgroundColor={this.state.theme.themeColor}
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40,borderWidth:0,elevation:2}} tabStyle={{height: 40}}
                                                      underlineHeight={2}/>}
            >
                {this.state.languages.map((result, i, arr)=> {
                    var language = arr[i];
                    return language && language.checked ?
                        <TrendingTab key={i} {...this.props} timeSpan={this.state.timeSpan} theme={this.state.theme}
                                     tabLabel={language.name}/> : null;
                })}
            </ScrollableTabView>
            : null;
        var statusBar={
            backgroundColor:this.state.theme.themeColor,
        }
        let navigationBar =
            <NavigationBar
                style={this.state.theme.styles.navBar}
                rightButton={ViewUtils.getMoreButton(()=>this.refs.moreMenu.open())}
                statusBar={statusBar}
                titleView={this.renderTitleView()}/>;
        let timeSpanView=
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={()=>this.closePopover()}
                contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
                style={{backgroundColor: 'red'}}>
                <View style={{alignItems: 'center'}}>
                    {timeSpanTextArray.map((result, i, arr) => {
                        return <TouchableHighlight key={i} onPress={()=>this.onSelectTimeSpan(arr[i])}
                                                   underlayColor='transparent'>
                            <Text
                                style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                                {arr[i].showText}
                            </Text>
                        </TouchableHighlight>
                    })
                    }
                </View>
            </Popover>
        let customThemeView=
            <CustomTheme
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={()=>{this.setState({customThemeViewVisible:false})}}/>
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {timeSpanView}
                {customThemeView}
                {this.renderMoreView()}
            </View>
        );
    }

}


class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.isRender = true;
        this.state = {
            isLoading: false,
            isLodingFail: false,
            favoritKeys: [],
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            filter: '',
            theme:this.props.theme,
        };
    }

    componentDidMount() {
        this.props.homeComponent.addSubscriber(this.onSubscriber);
        this.loadData(this.props.timeSpan,true);
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubscriber(this.onSubscriber);
    }

    onSubscriber = (preTab, currentTab)=> {
        var changedValues = this.props.homeComponent.changedValues;
        if(changedValues.my.themeChange)this.isRender=true;
        if (changedValues.my.themeChange && preTab.styles) {
            this.setState({
                theme: preTab
            })
            this.updateFavorite();//更新favoriteIcon
            return;
        }
        if (currentTab != FLAG_TAB.flag_trendingTab)return;
        if (FLAG_TAB.flag_favoriteTab === preTab && changedValues.favorite.trendingChange) {//从收藏页面切换过来,且Trending收藏有改变
            // changedValues.favorite.trendingChange = false;
            this.updateFavorite();
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.isRender) {
            this.isRender = false;
            return true;
        } else {
            return false;
        }
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }
    }

    updateFavorite() {
        this.getFavoriteKeys();
    }

    flushFavoriteState() {//更新ProjectItem的Favorite状态
        projectModels = [];
        var items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], this.checkFavorite(items[i])));
        }
        this.isRender = true;
        this.updateState({
            isLoading: false,
            isLodingFail: false,
            dataSource: this.getDataSource(projectModels),
        });
    }

    getFavoriteKeys() {//获取本地用户收藏的ProjectItem
        favoriteDao.getFavoriteKeys().then((keys)=> {
            if (keys) {
                this.updateState({
                    favoritKeys: keys
                })
            }
            this.flushFavoriteState();
        }).catch((error)=> {
            this.flushFavoriteState();
            console.log(error);
        });
    }

    genFetchUrl(timeSpan, category) {//objective-c?since=daily
        return API_URL + category + '?' + timeSpan.searchText;
    }

    loadData(timeSpan,isRefresh) {
        this.updateState({
            isLoading: true,
            isLoadingFail: false,
        });
        this.isRender = true;
        let url=this.genFetchUrl(timeSpan, this.props.tabLabel);
        dataRepository.fetchRepository(url).then((wrapData)=>{
            this.items=wrapData&&wrapData.items? wrapData.items:wrapData? wrapData:[];
            this.getFavoriteKeys();
            if(isRefresh&&wrapData&&wrapData.date&&!dataRepository.checkDate(wrapData.date))return dataRepository.fetchNetRepository(url);
        }).then((items)=>{
            if(!items||items.length===0)return;
            this.items=items;
            this.getFavoriteKeys();
        }).catch((error)=>{
            console.log(error);
            this.updateState({
                isLoading: false,
                isLoadingFail: true,
            });
        })
    }

    onRefresh() {
        this.loadData(this.props.timeSpan,true);
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }
    updateState(dic){
        if (!this)return;
        this.setState(dic);
    }
    onSelectRepository(projectModel) {
        var item = projectModel.item;
        this.props.navigator.push({
            title: item.fullName,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                parentComponent: this,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props
            },
        });
    }

    onFavorite(item, isFavorite) {//favoriteIcon单击回调函数
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.fullName);
        }
    }

    checkFavorite(item) {//检查该Item是否被收藏
        for (var i = 0, len = this.state.favoritKeys.length; i < len; i++) {
            if (item.fullName === this.state.favoritKeys[i]) {
                return true;
            }
        }
        return false;
    }

    renderRow(projectModel, sectionID, rowID) {
        let {navigator}=this.props;
        return (
            <TrendingRepoCell
                key={projectModel.item.fullName}
                onSelect={()=>this.onSelectRepository(projectModel)}
                projectModel={projectModel}
                theme={this.state.theme}
                {...{navigator}}
                onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}/>
        );
    }

    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e)=>this.renderRow(e)}
                renderFooter={()=> {
                    return <View style={{height: 50}}/>
                }}
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
    },
    listView: {
        // marginTop:-20,
    },
});
