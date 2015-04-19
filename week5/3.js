var Waterline = require('waterline');
var diskAdapter = require('sails-disk');


var config = {
  adapters: {
    'default': diskAdapter,
    disk: diskAdapter
  },

  connections: {
    myLocalDisk: {
      adapter: 'disk',
      filePath: './data/'
    }
  },

  defaults: {
    migrate: 'alter'
  }

};

// define a model,
// By default, an attribute named id will be
var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'myLocalDisk',

  attributes: {
    first_name: 'string',
    last_name: 'string'
  }
});



var orm = new Waterline();

orm.loadCollection(User);

orm.initialize(config, function(err, models) {
  if(err) throw err;

  models.collections.user.create({
    first_name: 'Glen',
    last_name: 'lei'
  }, function (err, ret) {
    if (err) throw err;

    console.log(ret);

    models.collections.user.find({}, console.log);
  });

});
