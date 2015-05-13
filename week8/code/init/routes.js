/**
 * 注册路由
 */

module.exports = function (app) {

  var utils = require('lei-utils');
  var bodyParser = require('body-parser');
  var connect = require('connect');
  var models = require('./models');


  // 解析POST数据的中间件
  var parseBody = connect();
  parseBody.use(bodyParser.urlencoded({extended: false}));
  parseBody.use(bodyParser.json());


  // 检查用户是否登录的中间件
  function checkLogin (req, res, next) {
    if (req.session.loginName) {
      next();
    } else {
      res.redirect('/login?return_url=' + req.url);
    }
  }



  app.get('/login', function (req, res, next) {
    res.render('login');
  });

  app.post('/login', parseBody, function (req, res, next) {
    if (!req.body.name) return renderError('请填写用户名');
    if (!req.body.password) return renderError('请填写密码');

    models.get('user').findOne({name: req.body.name}, function (err, user) {
      if (err) return renderError(err);
      if (!user) return renderError('用户不存在');
      if (!utils.validatePassword(req.body.password, user.password)) return renderError('密码不正确');

      req.session.loginName = user.name;
      req.session.logoutCode = Math.random().toString();
      res.redirect(req.query.return_url || '/');
    });

    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('login');
    }
  });

  app.get('/logout', function (req, res, next) {
    if (req.query.code === req.session.logoutCode) {
      delete req.session.loginName;
    }
    res.redirect('/');
  });


  app.get('/signup', function (req, res, next) {
    res.render('signup');
  });

  app.post('/signup', parseBody, function (req, res, next) {
    if (!req.body.name) return renderError('请填写用户名');
    if (!req.body.password) return renderError('请填写密码');

    models.get('user').findOne({name: req.body.name}, function (err, user) {
      if (err) return renderError(err);
      if (user) return renderError('用户已存在');

      models.get('user').create({
        name: req.body.name,
        password: utils.encryptPassword(req.body.password)
      }, function (err) {
        if (err) return renderError(err);

        res.end('注册成功');
      });
    });

    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('signup');
    }
  });



  app.get('/', function (req, res, next) {
    models.get('article').find().exec(function (err, list) {
      if (err) return next(err);
      res.locals.article_list = list;

      res.render('index');
    });
  });



  app.get('/admin', checkLogin, function (req, res, next) {
    models.get('article').find().exec(function (err, list) {
      if (err) return next(err);
      res.locals.article_list = list;

      res.render('admin/article_list');
    });
  });


  app.get('/admin/post', checkLogin, function (req, res, next) {
    res.render('admin/article_edit');
  });

  app.post('/admin/post', checkLogin, parseBody, function (req, res, next) {
    if (!req.body.title) return renderError('请填写标题');
    if (!req.body.content) return renderError('请填写内容');

    models.get('article').create({
      author: req.session.loginName,
      title: req.body.title,
      content: req.body.content
    }, function (err) {
      if (err) return renderError(err);

      res.redirect('/admin');
    });

    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('admin/article_edit');
    }
  });


  app.get('/article/:id/edit', checkLogin, function (req, res, next) {
    models.get('article').findOne({id: req.params.id}, function (err, article) {
      if (err) return next(err);
      if (!article) return next('文章不存在');
      res.locals.input = article;

      res.render('admin/article_edit');
    });
  });

  app.post('/article/:id/edit', checkLogin, parseBody, function (req, res, next) {
    if (!req.body.title) return renderError('请填写标题');
    if (!req.body.content) return renderError('请填写内容');

    models.get('article').update({id: req.params.id}, {
      author: req.session.loginName,
      title: req.body.title,
      content: req.body.content
    }, function (err) {
      if (err) return renderError(err);

      res.redirect('/admin');
    });

    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('admin/article_edit');
    }
  });

  app.get('/article/:id', function (req, res, next) {
    models.get('article').findOne({id: req.params.id}, function (err, article) {
      if (err) return next(err);
      if (!article) return next('文章不存在');
      res.locals.article = article;

      res.render('article_view');
    });
  });


  app.post('/article/:id/delete', checkLogin, parseBody, function (req, res, next) {
    models.get('article').destroy({id: req.params.id}, function (err, ret) {
      if (err) return res.json({error: err});
      res.json({id: req.params.id});
    });
  });

};
