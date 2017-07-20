"use strict";
exports.__esModule = true;
var express = require("express");
var path_1 = require("path");
var helmet = require("helmet");
var compression = require("compression"); // compresses requests
var bodyParser = require("body-parser");
var logger = require("morgan");
var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var expressSession = require("express-session");
var i18n = require("i18n");
var util_1 = require("util");
var lodash_1 = require("lodash");
var appLocals = ['en', 'mr', 'hi'];
var app = express();
app.set('views', path_1.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
i18n.configure({
    locales: appLocals,
    directory: path_1.join(__dirname, '..', 'i18n'),
    cookie: 'lang',
    queryParameter: 'lang',
    directoryPermissions: '755'
});
app.use(i18n.init);
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(flash());
app.use(methodOverride());
app.use(express.static(path_1.join(__dirname, '..', 'public')));
app.get('/preference/:lang', function (req, res, next) {
    if (appLocals.indexOf(req.params.lang) === -1) {
        next(createError(406, 'LANG_PREF_ERROR_NOT_FOUND'));
    }
    else {
        i18n.setLocale(req, req.params.lang);
        res.cookie('lang', req.params.lang);
        if (req.query.json === '') {
            res.jsonp({ "lang": req.params.lang });
        }
        else {
            res.sendStatus(200);
        }
    }
});
app.use(function (req, res, next) {
    next(createError(404, 'NOT_FOUND'));
});
app.use(function (err, req, res, next) {
    err = (err || new Error('Something broke!'));
    res.status(err.status || 500);
    if (req.query.json === '') {
        var error = new Error();
        error.status = err.status || 500;
        if (util_1.isString(err.i18n)) {
            error.code = err.i18n;
            error.message = req.__(err.i18n);
        }
        else {
            var error_1 = {};
            var keys = Object.keys(error_1);
            for (var i = 0; i < keys.length; i++) {
                error_1[keys[i]] = req.__(error_1[keys[i]]);
            }
        }
        res.jsonp(error);
    }
    else {
        var error = {
            title: err.title || err.status,
            subtitle: req.__(err.i18n) || err.message || 'We are processing your things'
        };
        res.render('500', lodash_1.assign({}, error, { localsArray: appLocals, currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl }));
    }
});
function createError(status, i18n, message) {
    var err = new Error(message || i18n);
    err.status = status;
    err.i18n = i18n;
    return err;
}
exports.App = app;
