var redis = require('redis');


var client = redis.createClient(6379, '127.0.0.1');


/*
client.set('abc', 123, function (err, ret) {
  if (err) throw err;
  console.log(ret);
  client.quit();
});
*/

client.get('abc', function (err, ret) {
  if (err) throw err;
  console.log(ret);
  client.quit();
});
