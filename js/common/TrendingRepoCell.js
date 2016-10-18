/**
 *
 *
 * @flow
 */
'use strict';

import React, {Component} from 'react'
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    View,
    Alert,
} from 'react-native'
import GlobalStyles from '../../res/styles/GlobalStyles'
import HTMLView from 'react-native-htmlview'
import WebViewPage from '../page/WebViewPage'

export default class TrendingRepoCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
        };
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }

    render() {
        var item = this.props.projectModel.item;
        var TouchableElement = TouchableHighlight;
        var description='<p>'+item.description+'</p>';
        return (
            <TouchableElement
                onPress={this.props.onSelect}
                onShowUnderlay={this.props.onHighlight}
                underlayColor='transparent'
                onHideUnderlay={this.props.onUnhighlight}>
                <View style={GlobalStyles.cell_container}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.title}>
                            {item.fullName}
                        </Text>

                    </View>
                    {/*<Text style={styles.description}>*/}
                        {/*{item.description}*/}
                    {/*</Text>*/}
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {
                            this.props.navigator.push({
                                component: WebViewPage,
                                params: {
                                    title:url,
                                    url:url,
                                    ...this.props
                                },
                            });
                        }}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description,
                        }}
                    />
                    <Text style={[styles.description, {fontSize: 14}]}>
                        {item.meta}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.author}>Built by  </Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={{width: 22, height: 22,margin:2}}
                                    source={{uri: arr[i]}}
                                />
                             })
                            }
                        </View>
                        <TouchableHighlight
                            style={{padding:6}}
                            onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
                            <Image
                                ref='favoriteIcon'
                                style={[{width: 22, height: 22,},this.props.theme.styles.tabBarSelectedIcon]}
                                source={this.state.favoriteIcon}/>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableElement>
        );
    }
}


var styles = StyleSheet.create({
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    author: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
});

