var express = require('express');

function checkLanguage(languages) {
    var defaultLanguage = languages[0].toLowerCase();

    function parseLanguages(str) {
        return str.toLowerCase().split(',').map(function (item) {
            var s = item.split(';');
            var l = s[0].toLowerCase();
            var q = s[1] || 'q=1';
            if (q.substr(0, 2) === 'q=') {
                q = Number(q.substr(2));
            } else {
                q = 0;
            }
            return {l: l, q: q};
        }).sort(function (a, b) {
            // 降序排序
            return b.q - a.q;
        });
    }

    return function (req, res, next) {
        req.acceptLanguages = parseLanguages(req.headers['accept-language'] || defaultLanguage);

        for (var i = 0; i < req.acceptLanguages.length; i++) {
            if (languages.indexOf(req.acceptLanguages[i].l) !== -1) {
                req.acceptLanguage = req.acceptLanguages[i].l;
                break;
            }
        }

        // 如果在accept-language中没有找到符合条件的语言，则使用默认语言
        if (!req.acceptLanguage) req.acceptLanguage = defaultLanguage;

        next();
    };
}

var app = express();
app.use(checkLanguage(['zh-cn', 'en']));

app.get('/', function (req, res, next) {
    res.setHeader('content-language', req.acceptLanguage);
    res.sendFile(__dirname + '/' + req.acceptLanguage + '.html');
});

app.listen(3001);
console.log('Server running at http://127.0.0.1:3001/');
