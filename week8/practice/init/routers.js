/**
 * Created by caoyangkaka on 5/9/15.
 */
module.exports = function (app) {
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    var models = require('./models');
    var utils = require('lei-utils');
    var md = require('../lib/utils').markdown;
    var xss = require('../lib/utils').xss;
    var noHTMLTag = require('../lib/utils').noHTMLTag;

    // check login
    function checkLogin(req, res, next) {
        if (req.session.loginName) {
            next();
        } else {
            res.redirect('/login?return_url=' + req.url);
        }
    }

    // for login
    app.get('/login', function (req, res, next) {
        res.render('login');
    });

    app.post('/login', function (req, res, next) {
        if (!req.body.name)
            return renderError('Please enter username!');
        if (!req.body.password)
            return renderError('Please enter password!');
        models.get('user').findOne({name: req.body.name}, function (err, user) {
            if (err) return renderError(err);
            if (!user) return renderError('Account doesn\' exists.!');
            if (!utils.validatePassword(req.body.password, user.password))
                return renderError('Password is not correct!');
            req.session.loginName = user.name;
            req.session.logoutCode = Math.random().toString();
            res.redirect(req.query.return_url || '/admin');
        });
        function renderError(err) {
            res.locals.error = err;
            res.locals.body = req.body.name || '';
            res.render('login');
        }
    });

    app.get('/logout', function (req, res, next) {
        if (req.query.logoutCode === req.session.logoutCode)
            delete req.session.loginName;
        res.redirect('/');
    });

    app.get('/register', function (req, res, next) {
        res.render('register');
    });

    app.post('/register', function (req, res, next) {
        if (!req.body.name) return renderError('Please enter username!');
        if (!req.body.password) return renderError('Please enter password!');

        models.get('user').findOne({name: req.body.name}, function (err, user) {
            if (err) return renderError(err);
            if (user) return renderError('Account already exists.');

            models.get('user').create({
                name: req.body.name,
                password: utils.encryptPassword(req.body.password)
            }, function (err) {
                if (err) return renderError(err);
                req.session.loginName = user.name;
                req.session.logoutCode = Math.random().toString();
                res.redirect('/admin');
            });
        });

        function renderError(err) {
            res.locals.error = err;
            res.locals.input = req.body;
            res.render('register');
        }
    });
    app.get('/', function (req, res, next) {

        models.get('article').find().exec(function (err, list) {
            if (err) return next(err);
            for (var i = 0; i < list.length; i++) {
                list[i].content = noHTMLTag(md(list[i].content));
            }
            res.locals.list = list;

            res.render('index');
        });
    });

    app.get('/admin', checkLogin, function (req, res, next) {

        models.get('article').find().exec(function (err, list) {
            if (err) return next(err);
            res.locals.list = list;

            res.render('admin/index');
        });
    });

    app.get('/admin/post', checkLogin, function (req, res, next) {
        res.render('admin/post');
    });

    app.post('/admin/post', checkLogin, function (req, res, next) {
        if (!req.body.title)
            return renderError('Please enter title!');
        if (!req.body.content)
            return renderError('Please enter content!');

        models.get('article').create({
            author: req.session.loginName,
            title: req.body.title,
            content: req.body.content
        }, function (err) {
            if (err) return renderError(err);
            res.redirect('/admin');
        });

        function renderError(err) {
            res.locals.error = err;
            res.locals.input = req.body;
            res.render('admin/post');
        }
    });

    app.get('/article/:id/edit', checkLogin, function (req, res, next) {
        models.get('article').findOne({id: req.params.id}, function (err, article) {
            if (err) return next(err);
            if (!article) return next('Article doesn\'t exist!');
            res.locals.error = err;
            res.locals.input = article;


            res.render('admin/post');
        });
    });

    app.post('/article/:id/edit', checkLogin, function (req, res, next) {
        if (!req.body.title) return renderError('Please Enter your title!');
        if (!req.body.content) return renderError('PLease Enter your content!');

        models.get('article').update({id: req.params.id}, {
            author: req.session.loginName,
            title: req.body.title,
            content: req.body.content
        }, function (err) {
            if (err) return renderError(err);
            res.redirect('/admin');
        });

        function renderError(err) {
            res.locals.error = err;
            res.locals.input = req.body;
            res.render('admin/post');
        }
    });

    app.get('/article/:id', function (req, res, next) {
        models.get('article').findOne({id: req.params.id}, function (err, article) {
            if (err) return next(err);
            if (!article) return next('Article doesn\'t exist!');
            res.locals.title = article.title;
            res.locals.content = xss(md(article.content));

            models.get('poster').find({articleId: parseInt(req.params.id)}, function (err, posters) {
                if (err) return next(err);
                res.locals.posters = posters;
                res.render('article_view', {layout: null});
            });
        });
    });

    app.post('/article/:id', checkLogin, function (req, res, next) {
        if (!req.body.postTitle) return renderError('Please enter your post title!');
        if (!req.body.postContent) return renderError('Please enter your content');
        models.get('poster').create({
            author: req.session.loginName,
            title: req.body.postTitle,
            content: req.body.postContent,
            articleId: parseInt(req.params.id)
        }, function (err) {
            if (err) return renderError(err);
            res.redirect('/article/' + req.params.id);
        });

        function renderError(err) {
            res.locals.error = err;
            res.locals.input = req.body;
            res.redirect('/article/' + req.params.id);
        }
    });

    app.get('/article/:id/delete', checkLogin, function (req, res, next) {
        models.get('article').destroy({id: req.params.id}, function (err) {
            if (err) return next(err);
            res.redirect('/admin');
        });
    });

};