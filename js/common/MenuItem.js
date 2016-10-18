/**
 * 侧边菜单Item
 * @flow
 */

'use strict';
import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Image
} from 'react-native'
import MPColors from './MPColors'

export default class MenuItem extends React.Component {
  static propTypes = {
    icon: Image.propTypes.source,
    selectedIcon: Image.propTypes.source,
    selected:React.PropTypes.bool,
    title: React.PropTypes.string,
    badge: React.PropTypes.string,
    onPress: React.PropTypes.func
  };

  render() {
    var icon = this.props.selected ? this.props.selectedIcon : this.props.icon;
    var selectedTitleStyle = this.props.selected && styles.selectedTitle;
    var badge;
    if (this.props.badge) {
      badge = (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {this.props.badge}
          </Text>
        </View>
      );
    }
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          <Image style={styles.icon} source={icon} />
          <Text style={[styles.title, selectedTitleStyle]}>
            {this.props.title}
          </Text>
          {badge}
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: MPColors.lightText,
  },
  selectedTitle: {
    color: MPColors.darkText,
  },
  badge: {
    backgroundColor: '#DC3883',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
})
