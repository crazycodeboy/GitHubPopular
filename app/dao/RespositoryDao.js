/**
 * RespositoryDao
 * @flow
 */
'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;

function RespositoryDao(){//Singleton pattern
  if (typeof RespositoryDao.instance==='object') {
    return RespositoryDao.instance;
  }
  RespositoryDao.instance=this;
}
RespositoryDao.prototype.saveRespository=function(key:string,items:Array<any>,
  callback?: ?(error: ?Error, result: ?Object) => void) {
    AsyncStorage.setItem(key,JSON.stringify(items),callback);
}
RespositoryDao.prototype.removeRespository=function(key:string) {
    AsyncStorage.removeItem(key,(error,result)=>{
      console.log(error);
    });
}
RespositoryDao.prototype.getRespository=function(key:string) {
  return new Promise((resolve,reject)=>{
    AsyncStorage.getItem(key,(error,result)=>{
      if (!error) {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(e);
          console.console.error(e);
        }
      }else {
        reject(error);
        console.console.error(error);
      }
    });
  });
}
module.exports = RespositoryDao;
