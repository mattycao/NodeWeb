var Models = require('../lib/models');

// 创建一个models实例
var models = new Models({
    adapter: 'mysql',
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'dataguru'
});

// 注册模型user
models.register({
    identity: 'user',
    attributes: {
        name: 'string',
        password: 'string'
    }
});

// 注册模型article
models.register({
    identity: 'article',
    attributes: {
        author: 'string',
        title: 'string',
        //we better use ethe text type for the long content
        content: 'text'
    }
});

// 注册模型poster
models.register({
    identity: 'poster',
    attributes: {
        author: 'string',
        title: 'string',
        //we better use ethe text type for the long content
        content: 'text',
        articleId: 'integer'
    }
});

// 初始化所以模型
models.initialize(function (err) {
    if (err) throw err;

    console.log('models initialized.');
});


module.exports = models;
