/**
 * DataRepository
 * 刷新从网络获取;非刷新从本地获取,
 * 若本地数据过期,先返回本地数据,然后返回从网络获取的数据
 * @flow
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';
import Trending from "GitHubTrending";
export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}

export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
        if(flag===FLAG_STORAGE.flag_trending)this.treding=new Trending();
    }

    saveRepository(url, items, callback) {
        if (!items || !url)return;
        let wrapData={items:items,date:new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    fetchRepository(url) {
        return new Promise((resolve, reject)=> {
            this.fetchLocalRepository(url).then((wrapData)=> {
                if (wrapData) {
                    resolve(wrapData,true);
                } else {
                    this.fetchNetRepository(url).then((data)=> {
                        resolve(data);
                    }).catch((error)=> {
                        reject(error);
                    })
                }

            }).catch((error)=> {
                console.log('fetchLocalRepository fail:'+error);
                this.fetchNetRepository(url).then((data)=> {
                    resolve(data);
                }).catch((error=> {
                    reject(error);
                }))
            })
        })
    }

    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url, (error, result)=> {
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
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject)=> {
            if (this.flag === FLAG_STORAGE.flag_popular) {
                fetch(url)
                    .then((response)=>response.json())
                    .catch((error)=> {
                        reject(error);
                    }).then((responseData)=> {
                        if (!responseData||!responseData.items) {
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(responseData.items);
                        this.saveRepository(url,responseData.items)
                }).done();
            } else {
                this.treding.fetchTrending(url)
                    .then((items)=> {
                        if (!items) {
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(items);
                        this.saveRepository(url,items)
                    }).catch((error)=> {
                        reject(error);
                })
            }
        })
    }

    removeRepository(url) {
        AsyncStorage.removeItem(url, (error, result)=> {
            if(error)console.log(error);
        });
    }

    checkDate(longTime) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth())return false;
        if (currentDate.getDate() !== targetDate.getDate())return false;
        if (currentDate.getHours() - targetDate.getHours() > 4)return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }
}
