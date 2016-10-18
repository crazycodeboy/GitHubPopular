
import React,{Component} from 'react'
import {
    Navigator,
}from 'react-native'

import RepositoryUtils from '../expand/dao/RepositoryUtils'
import WelcomePage from './WelcomePage'


function setup(){

    RepositoryUtils.init(true);

    class Root extends Component {

        constructor(props) {
            super(props);
            this.state = {
            };
        }
        _renderScene(route, navigator) {
            let Component = route.component;
            return (
                <Component {...route.params} navigator={navigator}/>
            );
        }
        render() {
            return (
                <Navigator
                    initialRoute={{
                        name: 'WelcomePage',
                        component:WelcomePage
                    }}
                    renderScene={(e, i)=>this._renderScene(e, i)}
                />
            );
        }
    }

    return <Root/>;
}

module.exports = setup;