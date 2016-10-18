/**
 * 更多菜单
 * @flow
 */
'use strict';
import React, {Component,PropTypes} from 'react'
import {
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableHighlight,
    Text,
    Image,
    Linking,
    View,
} from 'react-native'
import Popover from "../common/Popover";
import CustomKeyPage from "../page/my/CustomKeyPage"
import SortKeyPagePage from "../page/my/SortKeyPagePage"
import AboutPage from "../page/about/AboutPage"
import AboutMePage from "../page/about/AboutMePage"
import FavoritePage from "../page/FavoritePage"
import {FLAG_LANGUAGE}  from '../expand/dao/LanguageDao'
export const MORE_MENU = {
    Custom_Language:'Custom Language',
    Sort_Language:'Sort Language',
    Custom_Theme:'Custom Theme',
    Custom_Key:'Custom Key',
    Sort_Key:'Sort Key',
    Remove_Key:'Remove Key',
    About_Author:'About Author',
    About:'About',
    Website:'Website',
    Feedback:'Feedback',
}

export default class MoreMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            buttonRect: {},
        }
    }

    static propTypes = {
        contentStyle: View.propTypes.style,
        menus:PropTypes.array,
    }

    open() {
        this.showPopover();
    }

    showPopover() {
        if (!this.props.anchorView)return;
        let anchorView=this.props.anchorView;
        if(anchorView instanceof FavoritePage){
            anchorView=anchorView.refs.moreMenuButton;
        }
        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({
            isVisible: false,
        });
        if (typeof(this.props.onClose) == 'function')this.props.onClose();
    }

    onMoreMenuSelect(tab) {
        this.closePopover();
        if (typeof(this.props.onMoreMenuSelect) == 'function')this.props.onMoreMenuSelect(tab);
        let TargetComponent, params={...this.props,menuType:tab};
        switch (tab) {
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPagePage;
                params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPagePage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Feedback:
                Linking.openURL('mailto:crazycodeboy@gmail.com');
                break;

        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    renderMoreView() {
        let view = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement="bottom"
            onClose={()=>this.closePopover()}
            contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
            contentMarginRight={20}
        >
            <View style={{alignItems: 'center',}}>
                {this.props.menus.map((result, i, arr) => {
                    return <TouchableHighlight key={i} onPress={()=>this.onMoreMenuSelect(arr[i])}
                                               underlayColor='transparent'>
                        <Text
                            style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                            {arr[i]}
                        </Text>
                    </TouchableHighlight>
                })
                }

            </View>
        </Popover>;
        return view;
    }

    render() {
        return (this.renderMoreView());
    }

}