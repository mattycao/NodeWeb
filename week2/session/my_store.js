/**
 * Created by caoyangkaka on 3/28/15.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (session) {

    var Store = session.Store;

    // Constructor function of MyStore, take the current one if no dir
    function MyStore(dir) {
        this._dir = dir || '.';
        //create the dir directory if not exists
        fs.mkdir(path.resolve(this._dir), 0777, function (error) {
            if (error) {
                if (error.code == 'EEXIST') {
                    // do nothing if the directory already exists
                    console.log(dir + ' directory already exists.');
                }
                else {
                    //不知道在这里怎么处理合适，请老师指教~~谢谢
                    console.log('Error happen when want create the directory.');
                }
            } else {
                // if no error, then create successfully
                console.log(dir + ' has been created.');
            }
        });
    }

    MyStore.prototype.__proto__ = Store.prototype;

    MyStore.prototype.get = function (sid, callback) {
        console.log('get: sid=%s', sid);
        var pathName = path.resolve(this._dir, sid + '.txt');

        //read the file content and return the data
        fs.readFile(pathName, 'utf8', function (err, data) {
            if (err) {
                return callback(err);
            }
            try {
                var result = JSON.parse(data);
            } catch (err) {
                return callback(err);
            }
            callback(null, result);
        });
    };

    MyStore.prototype.set = function (sid, session, callback) {
        console.log('set: sid=%s, session=%j', sid, session);
        //transfer the data to JSON and store it in the file
        try {
            var data = JSON.stringify(session);
        } catch (err) {
            return callback(err);
        }
        fs.writeFile((path.resolve(this._dir, sid + '.txt')), data, 'utf8', callback);
    };

    MyStore.prototype.destroy = function (sid, callback) {
        console.log('destroy: sid=%s', sid);
        fs.unlink((path.resolve(this._dir, sid + '.txt')), callback);
    };

    return MyStore;

};
