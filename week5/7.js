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

  identity: 'user',
  connection: 'localMySQL',

  attributes: {
    first_name: 'string',
    last_name: 'string',
    pet: {
      model: 'pet'
    }
  }
});


var Pet = Waterline.Collection.extend({

  identity: 'pet',
  connection: 'localMySQL',

  attributes: {
    name: 'string',
    type: 'string',
    user: {
      model: 'user'
    }
  }

});



var orm = new Waterline();

orm.loadCollection(User);
orm.loadCollection(Pet);

orm.initialize(config, function(err, models) {
  if(err) throw err;

  /*
  models.collections.user.create({
    first_name: 'Glen',
    last_name: 'lei'
  }, function (err, user) {
    if (err) throw err;

    console.log(user);

    models.collections.pet.create({
      name: 'lucy',
      type: 'cat',
      user: user.id
    }, function (err, pet) {
      if (err) throw err;

      console.log(pet);

      models.collections.user.update({id: user.id}, {pet: pet.id}, console.log);
    });
  });
  */

  //models.collections.user.find().populate('pet').exec(console.log);
  models.collections.pet.find().populate('user').exec(console.log);

});
