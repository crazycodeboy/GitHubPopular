/**
 * FavoriteDao
 * @flow
 */
'use strict';

var React = require('react-native');

function ProjectModel(item,isFavorite){
  this.item=item;
  this.isFavorite=isFavorite;
}
module.exports = ProjectModel;
