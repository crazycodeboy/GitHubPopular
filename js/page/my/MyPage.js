/**
 * 我的页面
 * @flow
 * **/
import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    Modal,
    Text,
    Platform,
    ScrollView,
    TouchableHighlight
} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import {MORE_MENU} from "../../common/MoreMenu";
import CustomKeyPage from "./CustomKeyPage";
import SortKeyPagePage from "./SortKeyPagePage";
import CustomThemePage from "./CustomTheme";
import AboutPage from '../about/AboutPage'
import AboutMePage from '../about/AboutMePage'
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
import ThemeDao from "../../expand/dao/ThemeDao";
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'

export default class MyPage extends Component {

    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
        this.state = {
            customThemeViewVisible: false,
            theme: this.props.theme,
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
        if (changedValues.my.themeChange && preTab.styles) {
            this.setState({
                theme: preTab
            })
            return;
        }
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, theme: this.state.theme, menuType: tab};
        switch (tab) {
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPagePage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPagePage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Custom_Theme:
                this.setState({customThemeViewVisible: true});
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponent =AboutPage;
                break;

        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    getItem(tag, icon, text) {
        return ViewUtils.getSettingItem(()=>this.onClick(tag), icon, text, this.state.theme.styles.tabBarSelectedIcon);
    }

    renderCustomThemeView() {
        return (
            <CustomThemePage
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={()=> {
                    this.setState({customThemeViewVisible: false})
                }}/>
        )
    }

    render() {
        var navigationBar =
            <NavigationBar
                style={this.state.theme.styles.navBar}
                title='My'/>;
        return (
            <View style={GlobalStyles.listView_container}>
                {navigationBar}
                <ScrollView >
                    {/*logo*/}
                    <TouchableHighlight
                        onPress={()=>this.onClick(MORE_MENU.About)}>
                        <View style={[styles.item, {height: 90}]}>
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                <Image source={require('../../../res/images/ic_trending.png')}
                                       style={[{width: 40, height: 40, marginRight: 10},this.state.theme.styles.tabBarSelectedIcon]}/>
                                <Text>GitHub Popular</Text>
                            </View>
                            <Image source={require('../../../res/images/ic_tiaozhuan.png')}
                                   style={[{
                                       opacity: 1,
                                       marginRight: 10,
                                       height: 22,
                                       width: 22,
                                       alignSelf: 'center',
                                   }, this.state.theme.styles.tabBarSelectedIcon]}/>
                        </View>
                    </TouchableHighlight>
                    <View style={GlobalStyles.line}/>

                    {/*Custom trending language*/}
                    <Text style={styles.groupTitle}>Custom trending language</Text>
                    {/*Custom Language*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Language, require('./img/ic_custom_language.png'), 'Custom Language')}
                    {/*Sort language*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Language, require('./img/ic_swap_vert.png'), 'Sort language')}

                    {/*Custom popular key*/}
                    <Text style={styles.groupTitle}>Custom popular key</Text>
                    {/*custom Key*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Key, require('./img/ic_custom_language.png'), 'Custom Key')}
                    {/*Sort Key*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Key, require('./img/ic_swap_vert.png'), 'Sort Key')}
                    {/*Remove Key*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Remove_Key, require('./img/ic_remove.png'), 'Remove Key')}

                    {/*Setting*/}
                    <Text style={styles.groupTitle}>Setting</Text>
                    {/*Custom theme*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Theme, require('./img/ic_view_quilt.png'), 'Custom theme')}
                    {/*Night mode*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem('about', require('./img/ic_brightness.png'), 'Night mode')}
                    {/*About author*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.About_Author, require('./img/ic_insert_emoticon.png'), 'About author')}
                    <View style={[{marginBottom: 60}]}/>
                </ScrollView>
                {this.renderCustomThemeView()}
            </View>
        );
    }

}
const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    groupTitle: {
        // fontWeight:'500',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'

    },
})