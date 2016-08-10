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
    RefreshControl,
    View,
} from 'react-native'
import RepositoryCell from './RepositoryCell'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from './dao/FavoriteDao'
import ProjectModel from './model/ProjectModel'
import NavigationBar from './NavigationBar'
var favoriteDao = new FavoriteDao()
export default class FavoritePage extends Component {
    constructor(propos) {
        super(propos);
        this.state = {
            isLoading: false,
            isLodingFail: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            filter: ''
        };
    }

    componentDidMount() {
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
        favoriteDao.getAllItems().then((items)=> {
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
        // var belongNavigator=this.props.homeComponent.refs.navFavorite;
        var item = projectModel.item;
        this.props.navigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
            },
        });
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    renderRow(projectModel, sectionID, rowID) {
        return (
            <RepositoryCell
                key={projectModel.item.id}
                onFavorite={(e)=>this.onFavorite(e)}
                isFavorite={true}
                onSelect={()=>this.onSelectRepository(projectModel)}
                projectModel={projectModel}/>
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        var style = styles.rowSeparator;
        if (adjacentRowHighlighted) {
            style = [style, styles.rowSeparatorHide];
        }
        return (
            <View key={'SEP_' + sectionID + '_' + rowID} style={style}/>
        );
    }

    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e)=>this.renderRow(e)}
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
        var navigationBar = Platform.OS === "android" ?
            <NavigationBar
                leftButtonIcon={require('../res/images/ic_menu_white_24dp.png')}
                onLeftButtonClick={()=>this.props.drawer.openDrawer()}
                title='Favorite'/> :
            <NavigationBar
                title='Favorite'/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        );
    }
};
var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        // backgroundColor:'red'
    },
    listView: {
        marginTop: Platform.OS === "ios" ? -20 : 0,
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
