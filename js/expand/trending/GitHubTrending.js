/**
 * 从https://github.com/trending获取数据
 * https://github.com/crazycodeboy
 * @flow
 */
import TrendingUtil from './TrendingUtil';

export default class GitHubTrending {
  GitHubTrending(){//Singleton pattern
    if (typeof GitHubTrending.instance==='object') {
      return GitHubTrending.instance;
    }
    GitHubTrending.instance=this;
  }
  fetchTrending(url){
    return new Promise((resolve,reject)=>{
      fetch(url)
      .then((response)=>response.text())
      .catch((error)=>{
        reject(error);
        console.log(error);
      }).then((responseData)=>{
        try {
          resolve(TrendingUtil.htmlToRepo(responseData));
        } catch (e) {
          reject(e);
        }
      }).done();
    });
  }



}
