var Waterline = require('waterline');

// 创建一个models实例，其中config为Waterline.initialize()时
// connections中的一项，用于配置一个数据库连接
function Models (config) {

  var adapters = {};
  adapters['default'] = adapters[config.adapter] = require('sails-' + config.adapter);

  this._config = {
    adapters: adapters,
    connections: {
      'default': config
    },
    defaults: {
      migrate: 'alter'
    }
  };

  this._orm = new Waterline();
}

// 注册一个模型，model的内容为Waterline.Collection.extend()时传入的参数，但是不需要指定connection属性
// 并且在创建模型后自动执行Waterline.loadCollection()
Models.prototype.register = function (model) {
  model.connection = 'default';
  this._orm.loadCollection(Waterline.Collection.extend(model));
};

// 初始化Waterline，即执行Waterline.initialize()
Models.prototype.initialize = function (callback) {
  var me = this;
  me._orm.initialize(me._config, function(err, models) {
    if (err) return callback(err);

    me._collections = models.collections;
    callback(null, me._collections);
  });
};

// 获取指定名称的模型，比如models.get('user')相当于Waterline.initialize()回调函数中的models.collections.user
Models.prototype.get = function (name) {
  return this._collections[name];
};

module.exports = Models;
