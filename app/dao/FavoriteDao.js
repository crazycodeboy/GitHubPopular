/**
 * FavoriteDao
 * @flow
 */
'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;
var FAVORITE_KEY='favorite_key'
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
    AsyncStorage.setItem(key,vaule,(error,result)=>{
      if (!error) {//更新Favorite的key
        this.updateFavoriteKeys(key);
      }
    });
}
FavoriteDao.prototype.updateFavoriteKeys=function(key:string){//更新Favorite key集合,若key已存在则删除此key，不存在则添加此key
  AsyncStorage.getItem(FAVORITE_KEY,(error,result)=>{
    if (!error) {
      var favoriteKeys=[];
      if (result) {
        favoriteKeys=JSON.parse(result);
      }
      var index=favoriteKeys.indexOf(key);
      if (index===-1) {
        favoriteKeys.push(key);
      }else {
        favoriteKeys.splice(index, 1);
      }
      AsyncStorage.setItem(FAVORITE_KEY,JSON.stringify(favoriteKeys));
    }
  });
}
FavoriteDao.prototype.getFavoriteKeys=function(){//获取收藏的Respository对应的key
  return new Promise((resolve,reject)=>{
    AsyncStorage.getItem(FAVORITE_KEY,(error,result)=>{
      if (!error) {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(error);
        }
      }else {
        reject(error);
      }
    });
  });
}
FavoriteDao.prototype.removeFavoriteItem=function(key:string) {
    AsyncStorage.removeItem(key,(error,result)=>{
      if (!error) {
        this.updateFavoriteKeys(key);
      }
    });
}
FavoriteDao.prototype.getAllItems=function() {
  return new Promise((resolve,reject)=>{
    this.getFavoriteKeys().then((keys)=>{
      var items=[];
      if (keys) {
        AsyncStorage.multiGet(keys, (err, stores) => {
          try {
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
      }else {
        resolve(items);
      }
    }).catch((e)=>{
      reject(e);
    });

    // AsyncStorage.getAllKeys((err, keys) => {
    //   console.log(keys);
    //   AsyncStorage.multiGet(keys, (err, stores) => {
    //     try {
    //        var items=[];
    //        stores.map((result, i, store) => {
    //          // get at each store's key/value so you can work with it
    //          let key = store[i][0];
    //          let value = store[i][1];
    //          if(value)items.push(JSON.parse(value));
    //         });
    //         resolve(items);
    //     } catch (e) {
    //       reject(e);
    //     }
    //   });
    // });


  });
}
module.exports = FavoriteDao;
