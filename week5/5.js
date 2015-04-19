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
    migrate: 'drop'
  }

};


var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'localMySQL',

  attributes: {
    first_name: {
      type: 'string',
      include_a: true
    },
    last_name: {
      type: 'string',
      required: true
    }
  },

  types: {
    include_a: function (name) {
      return name.indexOf('A') !== -1;
    }
  }
});



var orm = new Waterline();

orm.loadCollection(User);

orm.initialize(config, function(err, models) {
  if(err) throw err;

  models.collections.user.create({
    first_name: 'DDDA',
    last_name: 'XX'
  }, function (err, ret) {
    if (err) throw err;

    console.log(ret);

    models.collections.user.find({}, console.log);
  });

});
