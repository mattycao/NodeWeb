/**
 * Created by caoyangkaka on 4/17/15.
 */
//封装waterline模块，使得可以更简单使用waterline模块。比如定义一个Models对象，其提供的方法如下：
// 创建一个models实例，其中config为Waterline.initialize()时
// connections中的一项，用于配置一个数据库连接
// notice the config part
function Models(config) {
    // build an adapter object
    var adapters = {};
    // get the related adapter based on the adapter attribute of config
    adapters['default'] = adapters[config.adapter] = require('sails-' + config.adapter);

    // setting the read config object for the initialize function use
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
    // first setting the adapter
    model.connection = 'default';
    this._orm.loadCollection(Waterline.Collection.extend(model));
};

// 初始化Waterline，即执行Waterline.initialize()
Models.prototype.initialize = function (callback) {
    var self = this;
    self._orm.initialize(self._config, function (err, models) {
        if (err) return callback(err);
        // give the collections back to the models object
        self._collections = models.collections;
        callback(null, self._collections);
    });
};

// 获取指定名称的模型，比如models.get('user')相当于Waterline.initialize()回调函数中的models.collections.user
Models.prototype.get = function (name) {
    return this._collections[name];
};
//具体使用方法如下：
// 创建一个models实例
var models = new Models({
    adapter: 'disk',     // 选择的存储引擎，可选disk, mysql, mongo, memory, redis
    filePath: './data/'  // 相应的配置
});

// 注册模型pet
models.register({
    identity: 'pet',
    attributes: {
        name: 'string',
        type: 'string',
        user: {
            model: 'user'
        }
    }
});

// 注册模型user
models.register({
    identity: 'user',
    attributes: {
        first_name: 'string',
        last_name: 'string',
        pet: {
            model: 'pet'
        }
    }
});

// 初始化所以模型
models.initialize(function (err) {
    if (err) throw err;

    // 添加user记录
    models.get('user').create({
        first_name: '三',
        last_name: '张'
    }, function (err, user) {
        if (err) throw err;

        console.log(user);

        // 添加pet记录
        models.get('pet').create({
            name: '叮当猫',
            type: 'cat',
            user: user.id
        }, function (err, pet) {
            if (err) throw err;

            console.log(pet);

            // 更新user.pet
            models.get('user').update({id: user.id}, {pet: pet.id}, function (err, user) {
                if (err) throw err;

                console.log(pet);

                // 查询所有user
                models.get('user').find().populate('pet').exec(function (err, list) {
                    if (err) throw err;

                    console.log(list);
                });
            });
        });
    });
});
//要求：
//1、实现上述例子中的Models各方法，使得上面的例子能正常运行
//2、new Models()时，adapter可选disk, mysql, mongo, memory, redis中的任意一个，使得数据可存储在所选择的数据库上