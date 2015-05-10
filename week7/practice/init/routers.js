/**
 * Created by caoyangkaka on 5/9/15.
 */
module.exports = function (app) {
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    var models = require('./models');
    var utils = require('lei-utils');

    // for login
    app.get('/login', function (req, res, next) {
        res.render('login');
    });
    app.post('/login', function (req, res, next) {
        if (!req.body.name)
            return renderError('Please enter username!');
        if (!req.body.password)
            return renderError('Please enter password!');
        models.get('user').findOne({name: req.body.name}, function (err, user) {
            if (err) return renderError(err);
            if (!user) return renderError('Account doesn\' exists.!');
            if (!utils.validatePassword(req.body.password, user.password))
                return renderError('Password is not correct!');
            res.end('Login Successfully!');
        });
        function renderError(err) {
            res.locals.error = err;
            res.locals.body = req.body.name || '';
            res.render('login', {error: res.locals.error, input: res.locals.body});
        }
    });

    app.get('/register', function (req, res, next) {
        res.render('register');
    });

    app.post('/register', function (req, res, next) {
        if (!req.body.name) return renderError('Please enter username!');
        if (!req.body.password) return renderError('Please enter password!');

        models.get('user').findOne({name: req.body.name}, function (err, user) {
            if (err) return renderError(err);
            if (user) return renderError('Account already exists.');

            models.get('user').create({
                name: req.body.name,
                password: utils.encryptPassword(req.body.password)
            }, function (err) {
                if (err) return renderError(err);

                res.end('Register successfully.');
            });
        });

        function renderError (err) {
            res.locals.error = err;
            res.locals.input = req.body;
            res.render('register', {error: res.locals.error, input: res.locals.input});
        }
    });

};