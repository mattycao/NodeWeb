var Waterline = require('waterline');
var diskAdapter = require('sails-disk');
var mysqlAdapter = require('sails-mysql');


var config = {

  adapters: {
    'default': diskAdapter,
    disk: diskAdapter,
    mysql: mysqlAdapter
  },

  connections: {
    myLocalDisk: {
      adapter: 'disk',
      filePath: './data/'
    },
    localMySQL: {
      adapter: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'dataguru_test'
    }
  },

  defaults: {
    migrate: 'alter'
  }

};


var User = Waterline.Collection.extend({

  identity: 'user1',
  connection: 'localMySQL',

  attributes: {
    first_name: 'string',
    last_name: 'string'
  }
});



var orm = new Waterline();

orm.loadCollection(User);

orm.initialize(config, function(err, models) {
  if(err) throw err;

  models.collections.user1.create({
    first_name: 'Glen',
    last_name: 'lei'
  }, function (err, ret) {
    if (err) throw err;

    console.log(ret);

    models.collections.user1.find({}, console.log);
  });

});
