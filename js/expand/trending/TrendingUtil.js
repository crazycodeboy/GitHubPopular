/**
 * TrendingUtil
 * 工具类：用于将github trending html 转换成 TrendingRepoModel
 * https://github.com/crazycodeboy
 * @flow
 */


import TrendingRepoModel from './TrendingRepoModel';
import StringUtil from './StringUtil';

export default class TrendingUtil {
    static htmlToRepo(responseData) {
        responseData = responseData.substring(responseData.indexOf('<li class="repo-list-item'), responseData.indexOf('</ol>')).replace(/\n/, '');
        var repos = [];
        var splitWithH3 = responseData.split('<h3');
        splitWithH3.shift();
        for (var i = 0; i < splitWithH3.length; i++) {
            var repo = new TrendingRepoModel();
            var html = splitWithH3[i];

            this.parseRepoBaseInfo(repo, html);

            var metaNoteContent = this.parseContentOfNode(html, 'repo-list-meta');
            this.parseRepoMeta(repo, metaNoteContent);
            this.parseRepoContributors(repo, metaNoteContent);
            repos.push(repo);
        }
        return repos;
    }

    static parseContentOfNode(htmlStr, classFlag) {
        var noteEnd = htmlStr.indexOf(' class="' + classFlag);
        var noteStart = htmlStr.lastIndexOf('<', noteEnd) + 1;
        var note = htmlStr.substring(noteStart, noteEnd);

        var sliceStart = htmlStr.indexOf(classFlag) + classFlag.length + 2;
        var sliceEnd = htmlStr.indexOf('</' + note + '>', sliceStart);
        var content = htmlStr.substring(sliceStart, sliceEnd);
        return StringUtil.trim(content);
    }

    static parseRepoBaseInfo(repo, htmlBaseInfo) {
        var urlIndex = htmlBaseInfo.indexOf('<a href="') + '<a href="'.length;
        var url = htmlBaseInfo.slice(urlIndex, htmlBaseInfo.indexOf('">', urlIndex));
        repo.url = url;
        repo.fullName = url.slice(1, url.length);

        var description = this.parseContentOfNode(htmlBaseInfo, 'repo-list-description');
        var index = description.indexOf('</g-emoji>');
        if (index !== -1) {
            var indexEmoji = description.indexOf('</g-emoji>');
            var emoji = description.substring(description.indexOf('>') + 1, indexEmoji)
            description = emoji + description.substring(indexEmoji + '</g-emoji>'.length);
        }
        repo.description = description;
    }

    static parseRepoMeta(repo, htmlMeta) {
        var splitWit_n = htmlMeta.split('\n');
        if (splitWit_n[0].search('stars') === -1) {
            repo.language = splitWit_n[0];
        }
        for (var i = 0; i < splitWit_n.length; i++) {
            if (splitWit_n[i].search('stars') !== -1) {
                repo.meta = StringUtil.trim(splitWit_n[i]);
                break;
            }
        }
    }

    static parseRepoContributors(repo, htmlContributors) {
        var splitWitSemicolon = htmlContributors.split('"');
        repo.contributorsUrl = splitWitSemicolon[1];
        var contributors = [];
        for (var i = 0; i < splitWitSemicolon.length; i++) {
            var url = splitWitSemicolon[i];
            if (url.search('http') !== -1) {
                contributors.push(url);
            }
        }
        repo.contributors = contributors;
    }
}
