/**
 * 对Trending语言,Popular 关键字进行排序
 * @flow
 * **/

import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    View,
    Image,
    Text,
    Alert
} from 'react-native'
import SortableListView from 'react-native-sortable-listview'
import NavigationBar from '../../common/NavigationBar'
import BaseCommon from '../../common/BaseCommon'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import ViewUtils from '../../util/ViewUtils'

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon=new BaseCommon({...props,backPress:(e)=>this.onBackPress(e)});
        this.dataArray=[];
        this.sortResultArray=[];
        this.originalCheckedArray=[];
        this.state = {
            checkedArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
        this.baseCommon.componentDidMount();
    }
    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }
    onBackPress(){
        this.onBack();
        return true;
    }
    loadData() {
        this.languageDao.fetch().then((data)=> {
            this.getCheckedItems(data);
        }).catch((error)=> {
            console.log(error);
        });
    }
    getCheckedItems(dataArray){
        this.dataArray=dataArray;
        let checkedArray=[];
        for(let i=0,j=dataArray.length;i<j;i++){
            let data=dataArray[i];
            if(data.checked)checkedArray.push(data);
        }
        this.setState({
            checkedArray:checkedArray
        })
        this.originalCheckedArray=ArrayUtils.clone(checkedArray);
    }
    getSortResult(){
        this.sortResultArray=ArrayUtils.clone(this.dataArray);
        for(let i=0,j=this.originalCheckedArray.length;i<j;i++){
            let item=this.originalCheckedArray[i];
            let index=this.dataArray.indexOf(item);
            this.sortResultArray.splice(index,1,this.state.checkedArray[i]);
        }
    }
    onSave(haChecked) {
        if(!haChecked){
            if (ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)) {
                this.props.navigator.pop();
                return;
            }
        }
        this.getSortResult();
        this.languageDao.save(this.sortResultArray);
        if (this.props.flag === FLAG_LANGUAGE.flag_language) {
            this.props.homeComponent.changedValues.my.languageChange = true;
        } else {
            this.props.homeComponent.changedValues.my.keyChange = true;
        }
        if(this.props.fromPage){
            this.props.homeComponent.onReStart(this.props.fromPage);
        }else {
            this.props.navigator.pop();
        }
    }

    onBack() {
        if (!ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)) {
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
                        this.onSave(true);
                    }
                }
                ]
            )
        } else {
            this.props.navigator.pop();
        }
    }

    render() {
        let title = this.props.flag === FLAG_LANGUAGE.flag_language ? 'Sort Language' : 'Sort Key';
        let rightButtonConfig = {
            title: 'Save',
            handler:()=>this.onSave(),
            tintColor:'white',
        };
        let navigationBar =
            <NavigationBar
                title={title}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={this.props.theme.styles.navBar}
                rightButton={rightButtonConfig}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <SortableListView
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={(e) => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={row => <SortCell data={row} {...this.props}/>}
                />
            </View>
        )
    }

}

class SortCell extends Component {
    render() {
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked? styles.item:styles.hidden}
            {...this.props.sortHandlers}>
            <View style={{marginLeft:10,flexDirection:'row'}}>
                <Image source={require('./img/ic_sort.png')} resizeMode='stretch' style={[{opacity:1,width:16,height:16,marginRight:10,},this.props.theme.styles.tabBarSelectedIcon]}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2'
    },
    hidden:{
        height:0
    },
    item:{
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height:50,
        justifyContent:'center'
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
})
