var redis = require('redis');


var client = redis.createClient(6379, '127.0.0.1');


client.subscribe('my_channel_1');
client.subscribe('my_channel_2');

client.on('message', function (channel, message) {
  console.log('From: %s, message: %s', channel, message);
});
