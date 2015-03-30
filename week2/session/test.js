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
                if (error.code == 'EEXIST') ; // do nothing if the directory already exists
                else {
                    //不知道在这里怎么处理合适，请老师指教~~谢谢
                    console.log('Error happen when want create the directory.');
                }
            }
            // if no error, then create successfully
        });
    }

    MyStore.prototype.__proto__ = Store.prototype;

    MyStore.prototype._getFilename = function (sid) {
        return path.resolve(this._dir, sid + '.json');
    };

    MyStore.prototype.get = function (sid, callback) {
        console.log('get: sid=%s', sid);
        fs.readFile(this._getFilename(sid), function (err, json) {
            if (err) return callback(err);
            try {
                var data = JSON.parse(json.toString());
            } catch (err) {
                return callback(err);
            }
            callback(null, data);
        });
    };

    MyStore.prototype.set = function (sid, session, callback) {
        try {
            var data = JSON.stringify(session);
        } catch (err) {
            return callback(err);
        }
        fs.writeFile((path.resolve(this._dir, sid + '.txt')), data, function (err) {
            if (err) return callback(err);
        });
    };

    MyStore.prototype.destroy = function (sid, callback) {
        fs.unlink((path.resolve(this._dir, sid + '.txt')), function (err) {
            if (err) return callback(err);
        })
    };

    return MyStore;

};
