var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 1,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemore'
});


function startQuery () {
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    var field = 'lang';
    var value = 'zh-cn';
    connection.query('SELECT * FROM `link_list` WHERE ??=?', [field, value], function (err, ret) {
      if (err) throw err;

      console.log('results = %s', ret.length);
      setTimeout(function () {
        connection.release();
      }, 1000);
    });
  });
}


for (var i = 0; i < 10; i++) {
  startQuery();
}
