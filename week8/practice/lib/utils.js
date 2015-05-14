/**
 * Created by caoyangkaka on 5/14/15.
 */
var clone = require('clone');
var MarkdownIt = require('markdown-it');
var markdown = new MarkdownIt({html: true});
var xss = require('xss');
var whiteList = clone(xss.whiteList);
whiteList.embed = ['src', 'type', 'width', 'height'];
var filterXSS = new xss.FilterXSS({
    whiteList: whiteList
});


exports.markdown = function (content) {
    return markdown.render(content || '');
};

exports.xss = function (html) {
    return filterXSS.process(html || '');
};