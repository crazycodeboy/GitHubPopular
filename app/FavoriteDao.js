/**
 * FavoriteDao
 * @flow
 */
'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;

function FavoriteDao(){//Singleton pattern
  if (typeof FavoriteDao.instance==='object') {
    return FavoriteDao.instance;
  }
  FavoriteDao.instance=this;
}
// FavoriteDao.prototype._safeStorage=function(key:string){
//   return new Promise((resolve,reject)=>{
//     AsyncStorage.getItem(key,(error,result)=>{
//       var retData=JSON.parse(result);
//       if (error) {
//         console.console.error(error);
//         reject(error);
//       }else {
//         resolve(retData);
//       }
//     });
//   });
// }
FavoriteDao.prototype.saveFavoriteItem=function(key:string,vaule:string,
  callback?: ?(error: ?Error, result: ?Object) => void) {
    AsyncStorage.setItem(key,vaule,callback);
}
FavoriteDao.prototype.removeFavoriteItem=function(key:string) {
    AsyncStorage.removeItem(key,(error,result)=>{
      console.log('');
    });
}
FavoriteDao.prototype.getAllItems=function() {
  return new Promise((resolve,reject)=>{
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        try {
           var items=[];
           stores.map((result, i, store) => {
             // get at each store's key/value so you can work with it
             let key = store[i][0];
             let value = store[i][1];
             if(value)items.push(JSON.parse(value));
            });
            resolve(items);
        } catch (e) {
          reject(e);
        }
      });
    });
  });
}
module.exports = FavoriteDao;
