var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemore'
});

pool.getConnection(function (err, connection) {
  if (err) throw err;

  var field = 'lang';
  var value = 'zh-cn';
  connection.query('SELECT * FROM `link_list` WHERE ??=?', [field, value], function (err, ret) {
    if (err) throw err;

    console.log(ret);
    connection.release();
  });
});
