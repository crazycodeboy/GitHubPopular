/**
 * AboutPage
 * @flow
 **/
'use strict'
import React, {Component} from 'react';

import {
    Image,
    ScrollView,
    StyleSheet,
    Platform,
    Linking,
    Text,
    View,
} from 'react-native'
import NavigationBar from './NavigationBar'
export default class AboutPage extends Component {
    render() {
        var navigationBar = Platform.OS === "android" ?
            <NavigationBar
                leftButtonIcon={require('../res/images/ic_menu_white_24dp.png')}
                onLeftButtonClick={()=>this.props.drawer.openDrawer()}
                title='About'/> :
            <NavigationBar
                title='About'/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.content}>
                    <Text style={{}}>
                        This is a GitHub most popular repositories viewer with React Native.
                    </Text>
                    <Text style={styles.blogText}
                          onPress={()=>Linking.openURL('http://github.com/crazycodeboy')}
                    >
                        This project is open source in GitHub.
                    </Text>
                    <Text style={{marginTop: 20, fontWeight: '600'}}>
                        About Me:
                    </Text>
                    <View
                        style={styles.textLayout}>
                        <Text style={styles.blogName}>GitHub: </Text>
                        <Text
                            style={styles.blogText}
                            onPress={()=>Linking.openURL('http://github.com/crazycodeboy')}
                        >
                            github.com/crazycodeboy
                        </Text>
                    </View>
                    <View
                        style={styles.textLayout}>
                        <Text style={styles.blogName}>CSDN: </Text>
                        <Text
                            style={styles.blogText}
                            onPress={()=>Linking.openURL('http://blog.csdn.net/fengyuzhengfan/')}
                        >
                            blog.csdn.net/fengyuzhengfan/
                        </Text>
                    </View>
                    <View
                        style={styles.textLayout}>
                        <Text style={styles.blogName}>jianshu: </Text>
                        <Text
                            style={styles.blogText}
                            onPress={()=>Linking.openURL('http://jianshu.com/users/ca3943a4172a/latest_articles')}
                        >
                            jianshu.com/users/ca3943a4172a/latest_articles
                        </Text>
                    </View>
                    <View
                        style={styles.textLayout}>
                        <Text style={styles.blogName}>Emai: </Text>
                        <Text
                            style={styles.blogText}
                            //onPress={()=>Linking.openURL('email:crazycodeboy@gmail.com')}
                        >
                            crazycodeboy@gmail.com
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
;
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    },
    content: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    textLayout: {
        flexDirection: 'row', alignItems: 'center'
    },
    blogName: {
        fontSize: 13, color: 'gray', fontWeight: '400'
    },
    blogText: {
        color: 'dodgerblue', fontSize: 13, textDecorationLine: 'underline'
    },
})
