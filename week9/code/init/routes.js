/**
 * 注册路由
 */

module.exports = function (app) {

  var multipart = require('connect-multiparty');
  var utils = require('../lib/utils');
  var bodyParser = require('body-parser');
  var connect = require('connect');
  var models = require('./models');
  var cache = require('./cache');


  // 解析POST数据的中间件
  var parseBody = connect();
  parseBody.use(bodyParser.urlencoded({extended: false}));
  parseBody.use(bodyParser.json());
  parseBody.use(multipart());


  // 检查用户是否登录的中间件
  function checkLogin (req, res, next) {
    if (req.session.loginName) {
      next();
    } else {
      res.redirect('/login?return_url=' + req.url);
    }
  }


  // 生成文章的摘要
  function getArticleSummary (content) {
    return utils.noHTMLTag(utils.markdown(content)).slice(0, 1024);
  }


  app.get('/login', function (req, res, next) {
    res.render('login');
  });

  app.post('/login', parseBody, function (req, res, next) {
    if (!req.body.name) return renderError('请填写用户名');
    if (!req.body.password) return renderError('请填写密码');

    models.get('user').findOne({name: req.body.name}, function (err, user) {
      if (err) return renderError(err);
      if (!user) return renderError(res.__('user {{name}} does not exist', {name: req.body.name}));
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
      if (user) return renderError(res.__('user %s already exist', user.name));

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


  app.get('/forget_password', function (req, res, next) {
    res.render('forget_password');
  });
  
  app.post('/forget_password', parseBody, function (req, res, next) {
    if (!req.body.name) return renderError('请填写用户名');
    
    models.get('user').findOne({name: req.body.name}, function (err, user) {
      if (err) return renderError(err);
      if (!user) return renderError(res.__('user {{name}} does not exist', {name: req.body.name}));
      
      var code = utils.randomString(20);
      
      models.get('email_verify').create({
        code: code,
        user: user.name,
        op_type: 'reset_password'
      }, function (err) {
        if (err) return renderError(err);
        
        res.locals.success = '已往你的邮箱xxxxx@xx.com发送邮件，请点击邮件上的链接完成密码重设';
        res.render('forget_password');
        
        // 模拟发送邮件
        console.log('邮件：重设密码连接http://127.0.0.1:3001/reset_password?code=' + code);
      });
      
    });
    
    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('forget_password');
    }
  });
  
  
  function checkResetPasswordCode (req, res, next) {
    if (!req.query.code) return renderError('无效的验证链接');
    
    models.get('email_verify').findOne({code: req.query.code}, function (err, ret) {
      if (err) return renderError(err);
      if (!ret) return renderError('无效的验证链接');
      if (ret.op_type !== 'reset_password') return renderError('无效的验证链接');
      
      req.verifyInfo = ret;
      next();
    });
    
    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('reset_password');
    }
  }
  
  app.get('/reset_password', checkResetPasswordCode, function (req, res, next) {
    res.render('reset_password');
  });
  
  app.post('/reset_password', parseBody, checkResetPasswordCode, function (req, res, next) {
    if (!req.body.password) return renderError('请填写密码');
    
    models.get('email_verify').destroy({code: req.verifyInfo.code}, function (err) {
      if (err) return renderError(err);
      
      models.get('user').update({name:req.verifyInfo.user}, {
        password: utils.encryptPassword(req.body.password)
      }, function (err) {
        if (err) return renderError(err);
        
        res.locals.success = '新密码设置成功';
        res.render('reset_password');
      });
    });
    
    function renderError (err) {
      res.locals.error = err;
      res.locals.input = req.body;
      res.render('reset_password');
    }
  });
  

  app.get('/', function (req, res, next) {
    var query = {};
    if (req.blogInfo && req.blogInfo.user) {
      query.author = req.blogInfo.user;
    }
    models.get('article').find(query).exec(function (err, list) {
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
      summary: getArticleSummary(req.body.content),
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
      summary: getArticleSummary(req.body.content),
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
    cache.get('article_' + req.params.id, function (name, callback) {
      models.get('article').findOne({id: req.params.id}, function (err, article) {
        if (article) {
          article.content = utils.xss(utils.markdown(article.content));
        }
        callback(err, article);
      });
    }, function (err, article) {
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
