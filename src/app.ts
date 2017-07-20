import * as express from 'express';
import { join } from 'path';
import * as helmet from 'helmet';
import * as compression from 'compression';  // compresses requests
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as flash from 'express-flash';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as expressSession from 'express-session';
import * as i18n from 'i18n';
import {isString} from "util";
import { assign } from 'lodash';

const appLocals = ['en', 'mr', 'hi'];

const app = express();
app.set('views', join(__dirname, '..', 'views'));
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
    directory: join(__dirname, '..', 'i18n'),
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
app.use(express.static(join(__dirname, '..', 'public')));

app.get('/preference/:lang', (req, res, next) => {
    if (appLocals.indexOf(req.params.lang) === -1) {
        next(createError(406, 'LANG_PREF_ERROR_NOT_FOUND'));
    } else {
        i18n.setLocale(req, req.params.lang);
        res.cookie('lang', req.params.lang);
        if (req.query.json === '') {
            res.jsonp({"lang": req.params.lang});
        } else {
            res.sendStatus(200);
        }
    }
});

app.use(function(req, res, next) {
    next(createError(404, 'NOT_FOUND'));
});

app.use(function (err, req: express.Request , res, next) {
    err = (err || new Error('Something broke!'));
    res.status(err.status || 500);
    if (req.query.json === '') {
        const error = new Error() as any;
        error.status = err.status || 500;
        if (isString(err.i18n)) {
            error.code = err.i18n;
            error.message = req.__(err.i18n);
        } else {
            const error = {};
            const keys = Object.keys(error);
            for (let i = 0; i < keys.length; i++) {
                error[keys[i]] = req.__(error[keys[i]]);
            }
        }
        res.jsonp(error);
    } else {
        const error = {
            title: err.title || err.status,
            subtitle: req.__(err.i18n) || err.message || 'We are processing your things'
        };
        res.render('500', assign({}, error, {localsArray: appLocals, currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl}));
    }
});

function createError(status: number, i18n: string, message?: string) {
    const err = new Error(message || i18n) as any;
    err.status = status;
    err.i18n = i18n;
    return err;
}

export const App = app;
