var SuperCache = require('super-cache');

var cache = new SuperCache({
  ttl: 60,
  store: new SuperCache.RedisStore({
    host: '127.0.0.1',  // 服务器地址 
    port: 6379,         // 服务器端口 
    db: 9,              // 数据库号码 
    prefix: 'cache:',   // key前缀 
    auth_pass: ''       // 密码 
  })
});

module.exports = cache;
