var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '123.57.143.189',
    user: 'cy',
    password: 'cy',
    database: 'cy'
});

connection.connect(function (err) {
    if (err) throw err;
    // sql 注入
    //notice: if we set the
    /**
     * author = 'zhufeng OR "1" = "1"'
     * query = 'select from 'table' where 'author' 'zhufeng' OR "1" = "1"
     * thus, we will get all the result, so it is very dangerous
     *
     * Solution to this:
     * connection.escape() to uscape the query values here, like
     * connection.escape(value)
     * use the connection.
     * @type {string}
     */

    var field = 'lang';
    var value = 'zh-cn';
    connection.query('SELECT * FROM `person`', function (err, ret) {
        if (err) throw err;

        console.log(ret);
        connection.end();
    });
});
