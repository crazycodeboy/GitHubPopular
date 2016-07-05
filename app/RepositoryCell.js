 /**
 *
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Alert,
} = ReactNative;
var RespositoryCell = React.createClass({
  getInitialState(){
    return{
      isFavorite:false,
      favoriteIcon:require('../res/images/ic_star_border_gray_24dp.png')
    };
  },
  onPressFavorite(){
    this.setState({
      isFavorite:!this.state.isFavorite,
      favoriteIcon:this.state.isFavorite? require('../res/images/ic_star_border_gray_24dp.png'):require('../res/images/ic_star_border_green_24dp.png')
    });
    this.props.onFavorite(this.props.item,!this.state.isFavorite);
  },
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <TouchableElement
        ref='test'
        onPress={this.props.onSelect}
        onShowUnderlay={this.props.onHighlight}
        underlayColor='lightgreen'
        onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.title}>
                {this.props.item.full_name}
              </Text>

           </View>
           <Text style={styles.description}>
            {this.props.item.description}
           </Text>
           <View style={{flexDirection:'row',justifyContent:'space-between',}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.author}>Author: </Text>
                <Image
                  style={{width:22,height:22,}}
                  source={{uri: this.props.item.owner.avatar_url}}
                />
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.author}>Stars:  </Text>
                <Text style={styles.author}>
                  {this.props.item.stargazers_count}
                </Text>
              </View>
              {/*<TouchableHighlight onPress={()=>this.props.onFavorite(this.props.item,true)}>*/}
              <TouchableHighlight onPress={this.onPressFavorite} underlayColor='transparent'>
                <Image
                  ref='favoriteIcon'
                  style={{width:26,height:26,}}
                  source={this.state.favoriteIcon}/>
              </TouchableHighlight>
           </View>
        </View>
      </TouchableElement>
    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontSize: 14,
    marginBottom: 2,
    color:'#212121'
  },
  description: {
    fontSize: 12,
    marginBottom: 2,
    color:'#757575'
  },
  author:{
    fontSize: 14,
    marginBottom: 2,
    color:'#757575'
  },
  row: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
  },
});

module.exports = RespositoryCell;
