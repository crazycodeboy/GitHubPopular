/**
 * TrendingRepoModel
 * https://github.com/crazycodeboy
 * @flow
 */

export default class TrendingRepoModel {
  constructor(fullName,url,description,language,meta,contributors,contributorsUrl) {
    this.fullName = fullName;
    this.url = url;
    this.description = description;
    this.language = language;
    this.meta = meta;
    this.contributors = contributors;
    this.contributorsUrl = contributorsUrl;
  }
}
