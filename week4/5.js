var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/test', function(err, db) {
  if (err) throw err;

  /*
  db.collection('students').save({name: '黄七', age: 18}, function (err, ret) {
    if (err) throw err;
    console.log(ret);
  });*/


  db.collection('students').find().skip(2).limit(2).sort({age: -1}).toArray(function (err, list) {
    if (err) throw err;
    console.log(list);
    db.close();
  });


  /*
  db.collection('students').findOne({}, function (err, list) {
    if (err) throw err;
    console.log(list);
  });
*/
  /*
  db.collection('students').remove({name: '张三'}, function (err, ret) {
    if (err) throw err;
    console.log(ret);
  });
*/

});
