var Models = require('../lib/models');

// 创建一个models实例
var models = new Models({
  adapter: 'mysql',
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dataguru_test'
});

// 注册模型user
models.register({
  identity: 'user',
  attributes: {
    name: 'string',
    password: 'string',
    domain_name: 'string',
    theme: 'string'
  }
});

// 注册模型article
models.register({
  identity: 'article',
  attributes: {
    author: 'string',
    title: 'string',
    summary: 'string',
    content: 'text'
  }
});

// 注册模型email_verify
models.register({
  identity: 'email_verify',
  attributes: {
    code: 'string',
    user: 'string',
    op_type: 'string'
  }
});

// 初始化所以模型
models.initialize(function (err) {
  if(err) throw err;

  console.log('models inited.');
});


module.exports = models;
