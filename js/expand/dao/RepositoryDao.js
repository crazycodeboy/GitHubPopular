/**
 * RespositoryDao
 * @flow
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';

export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}

export default class RepositoryDao {
    constructor(flag) {
        this.flag = flag;
    }
    saveRepository = function (key, items, callback) {
        AsyncStorage.setItem(this.getKeyWithFlag(key), JSON.stringify(items), callback);
    }
    getRepository = function (key) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(this.getKeyWithFlag(key), (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            });
        });
    }
    removeRepository = function (key) {
        AsyncStorage.removeItem(this.getKeyWithFlag(key), (error, result)=> {
            console.log(error);
        });
    }
    getKeyWithFlag(key){
        return this.flag + '_' + key;
    }
}
