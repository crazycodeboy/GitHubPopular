/**
 * FavoriteDao
 * @flow
 */
'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;

FavoriteDao(){//Singleton pattern
  if (typeof FavoriteDao.instance==='object') {
    return FavoriteDao.instance;
  }
  FavoriteDao.instance=this;
}
FavoriteDao.prototype._safeStorage=function(key:string){
  return new Promise
}


module.exports = FavoriteDao;
