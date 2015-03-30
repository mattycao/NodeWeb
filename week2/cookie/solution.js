/**
 * Created by caoyangkaka on 3/28/15.
 */
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var async = require('async');

module.exports = function (session) {

    var Store = session.Store;

    function MyStore (options) {
        options = options || {};
        this._dir = options.dir || '.'; // 存储目录
        this._maxAge = options.maxAge || 0; // Session生存时间
        this._gcProbability = options.gcProbability || 0.1; // GC执行概率
        mkdirp.sync(this._dir);
    }

    MyStore.prototype.__proto__ = Store.prototype;

    // 返回session文件名
    MyStore.prototype._getFilename = function (sid) {
        return path.resolve(this._dir, sid + '.json');
    };

    // 取session数据
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

        if (this._isGCProbability()) this._startGC();
    };

    // 设置session数据
    MyStore.prototype.set = function (sid, session, callback) {
        console.log('set: sid=%s, session=%j', sid, session);
        try {
            var json = JSON.stringify(session);
        } catch (err) {
            return callback(err);
        }
        fs.writeFile(this._getFilename(sid), json, callback);
    };

    // 删除session数据
    MyStore.prototype.destroy = function (sid, callback) {
        console.log('destroy: sid=%s', sid);
        fs.unlink(this._getFilename(sid), callback);
    };

    // 判断是否满足执行GC的时机
    MyStore.prototype._isGCProbability = function () {
        return ((1 / this._gcProbability) * Math.random() <= 1)
    };

    // 执行GC
    MyStore.prototype._startGC = function () {
        var me = this;
        if (!(me._maxAge > 0)) return;

        console.log('start GC');
        fs.readdir(me._dir, function (err, list) {
            if (err) return console.error(err);

            // 最后修改时间在timestamp之前的文件将被清理
            var timestamp = Date.now() - me._maxAge;

            async.eachSeries(list, function (file, next) {
                var filename = path.resolve(me._dir, file);
                fs.stat(filename, function (err, stat) {
                    if (err) {
                        console.error(err);
                        return next();
                    }
                    if (stat.mtime.getTime() > timestamp) {
                        return next();
                    }

                    console.log('GC: delete file %s', filename);
                    fs.unlink(filename, function (err) {
                        if (err) console.error(err);
                        next();
                    });
                });

            }, function (err) {
                if (err) console.error(err);
                console.log('finished GC');
            });
        });
    };

    return MyStore;

};
