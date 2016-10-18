/**
 * 添加Trending语言,Popular 关键字
 * @flow
 * **/

import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Image,
    Alert
} from 'react-native'
import CheckBox from 'react-native-check-box'
import NavigationBar from '../../common/NavigationBar'
import BaseCommon from '../../common/BaseCommon'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import ViewUtils from '../../util/ViewUtils'

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon=new BaseCommon({...props,backPress:(e)=>this.onBackPress(e)});
        this.changeValues=[];
        this.isRemoveKey=this.props.menuType===MORE_MENU.Remove_Key;
        this.state = {
            dataArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
        this.baseCommon.componentDidMount();
    }
    componentWillUnmount(){
        this.baseCommon.componentWillUnmount();
    }
    onBackPress(e){
        this.onBack();
        return true;
    }
    loadData() {
        this.languageDao.fetch().then((data)=> {
            this.setState({
                dataArray: data
            })
        }).catch((error)=> {
            console.log(error);
        });
    }

    onClick(data) {
        if(!this.isRemoveKey)data.checked = !data.checked;
        ArrayUtils.updateArray(this.changeValues,data)
    }

    onSave() {
        if (this.changeValues.length ===0){
            this.props.navigator.pop();
            return;
        }
        if(this.isRemoveKey){
            for(let i=0,l=this.changeValues.length;i<l;i++){
                ArrayUtils.remove(this.state.dataArray,this.changeValues[i]);
            }
        }
        this.languageDao.save(this.state.dataArray);
        if(this.props.flag===FLAG_LANGUAGE.flag_language){
            this.props.homeComponent.changedValues.my.languageChange=true;
        }else{
            this.props.homeComponent.changedValues.my.keyChange=true;
        }
        if(this.props.fromPage){
            this.props.homeComponent.onReStart(this.props.fromPage)
        }else {
            this.props.navigator.pop();
        }
    }

    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert(
                'Confirm Exit',
                'Do you want to save your changes before exitting?',
                [
                    {
                        text: 'No', onPress: () => {
                        this.props.navigator.pop();
                    }
                    }, {
                    text: 'Yes', onPress: () => {
                        this.onSave();
                    }
                }
                ]
            )
        } else {
            this.props.navigator.pop();
        }
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0)return;
        var len = this.state.dataArray.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
            </View>
        )
        return views;

    }

    renderCheckBox(data) {
        let leftText = data.name;
        let isChecked=this.isRemoveKey?false:data.checked;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>this.onClick(data)}
                isChecked={isChecked}
                leftText={leftText}
                checkedImage={<Image source={require('../../page/my/img/ic_check_box.png')} style={this.props.theme.styles.tabBarSelectedIcon}/>}
                unCheckedImage={<Image source={require('../../page/my/img/ic_check_box_outline_blank.png')} style={this.props.theme.styles.tabBarSelectedIcon}/>}
            />);
    }

    render() {
        let rightButtonTitle=this.isRemoveKey? 'Remove':'Save';
        let rightButtonConfig = {
            title: rightButtonTitle,
            handler:()=>this.onSave(),
            tintColor:'white',
        };
        let navigationBar =
            <NavigationBar
                title={this.props.menuType}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={this.props.theme.styles.navBar}
                rightButton={rightButtonConfig}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2'
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
})