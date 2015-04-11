var mongoose = require('mongoose');
//used for multiple connection to mongodb
var connection = mongoose.createConnection('mongodb://127.0.0.1/test', function (err) {
  if (err) throw err;
});

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
  name: String,
  age: Number,
  other: String
});
connection.model('Student', schema);

var Student = connection.model('Student');

// in the find, the {} is not necessary
/*
Student.find({}).limit(2).sort({age: -1}).exec(function (err, ret) {
  if (err) throw err;
  console.log(ret);

  connection.close();
});
*/

// the stuff saved on the server by the mongoose will add one property of __v

var s = new Student({
  name: '张三1',
  age: 13,
  other: 'dongdong'
});
s.save(function (err, ret) {
  if (err) throw err;
  console.log(ret);
});

/*
Student.remove({name: '张三2'}, function (err, ret) {
  if (err) throw err;
  console.log(ret);
});
*/