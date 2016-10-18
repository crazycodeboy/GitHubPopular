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
import config from '../../../res/data/Config.json'
const URL = 'http://cboy.me/io/GitHubPopular/json/Config.json';
var repositoryUtils;
export default class RepositoryUtils {
    constructor(isInit) {
        if (isInit)this.start();
    }

    static init(isInit) {
        if (!repositoryUtils) {
            repositoryUtils = new RepositoryUtils(isInit);
        }
        return repositoryUtils;
    }

    start() {
        this.getConfig().then(result=> {
            this.config = JSON.parse(result);
            if (!this.checkDate(this.config.date, true)) {
                this.updateWithUrl(URL, true);
                this.updateRepositories();
            }
        }).catch(error=> {
            this.config = {'data': config};
            this.updateWithUrl(URL, true);
            this.updateRepositories();
        });

    }

    getConfig() {
        return new Promise((resolve, reject)=> {
            if(this.config){
                resolve(this.config.data);
                return;
            }
            AsyncStorage.getItem(URL, (error, result)=> {
                if (error || !result) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    updateWithUrl(url, isSaveDate) {
        fetch(url)
            .then((response)=>response.json())
            .then((responseData)=> {
                if (responseData)this.saveRepository(url, responseData, isSaveDate)
            }).catch((error)=> {
            console.log(error);
        });
    }

    updateRepositories() {
        let data = this.config.data;
        let url = data.info.url;
        for (let i = 0, l = data.items.length; i < l; i++) {
            this.updateWithUrl(url + data.items[i]);
        }
    }

    saveRepository(url, data, isSaveDate, callback) {
        if (!data || !url)return;
        if (isSaveDate) data = {data: data, date: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(data), callback);
    }

    fetchRepositories() {
        return new Promise((resolve, reject)=> {
            if (this.config) {
                let keys = [];
                let names = this.config.data.items;
                let url = this.config.data.info.url;
                for (let i = 0, l = names.length; i < l; i++) {
                    keys.push(url + names[i]);
                }
                let items = [];
                AsyncStorage.multiGet(keys, (err, stores) => {
                    try {
                        stores.map((result, i, store) => {
                            let key = store[i][0];
                            let value = store[i][1];
                            if (value)items.push(JSON.parse(value));
                        });
                        if(items.length===0)this.updateRepositories();
                        resolve(items);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                resolve(items);
            }
        })
    }

    fetchCurrentRepository() {
        return new Promise((resolve, reject)=> {
            let key = this.config.data.info.currentRepoUrl;
            AsyncStorage.getItem(key, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }

    checkDate(longTime, isWithDay) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth())return false;
        if (currentDate.getDate() !== targetDate.getDate())return false;
        if (isWithDay)return true;
        if (currentDate.getHours() - targetDate.getHours() > 4)return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }
}
