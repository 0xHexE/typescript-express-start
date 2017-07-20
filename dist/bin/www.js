#!/usr/bin/env node
"use strict";
exports.__esModule = true;
require("reflect-metadata");
var http = require("http");
var https = require("https");
var express = require("express");
var path = require("path");
var debug = require('debug')('test:server');
var app_1 = require("../app");
var fs = require("fs");
var dotenv = require("dotenv");
var appRoot = require("app-root-path");
dotenv.config();
/**
 * @class
 * This is the class which is responsible for running the application.
 */
var ServerApplication = (function () {
    /**
     * @constructor
     * @param {express.Application} app : This is the parameter for the express application you can reconfigure the application.
     * @param {number} port : This is port number where the application is going to run.
     * @param {http.Server} server this is the http application.
     */
    function ServerApplication(app, port, server, httpServerApp, httpServer) {
        if (app === void 0) { app = express(); }
        if (port === void 0) { port = ServerApplication.normalizePort(process.env.HTTP_PORT || '80'); }
        if (httpServerApp === void 0) { httpServerApp = express(); }
        this.app = app;
        this.port = port;
        this.server = server;
        this.httpServerApp = httpServerApp;
        this.httpServer = httpServer;
        if (process.env.SSL_ENABLE === 'true') {
            this.port = ServerApplication.normalizePort(process.env.HTTPS_PORT || '443');
            port = ServerApplication.normalizePort(process.env.HTTPS_PORT || '443');
            httpServerApp.get('*', function (req, res, next) {
                res.redirect('https://' + req.headers.host + '/' + req.path);
            });
            this.httpServer = http.createServer(httpServerApp).listen(ServerApplication.normalizePort(process.env.HTTP_PORT || '80'));
            this.server = https.createServer({
                ca: fs.readFileSync(path.join(appRoot().toString(), 'certificates', 'vendor.cert'), 'utf-8'),
                cert: fs.readFileSync(path.join(appRoot().toString(), 'certificates', 'certificate.cert'), 'utf-8'),
                key: fs.readFileSync(path.join(appRoot().toString(), 'certificates', 'private.key'))
            }, app);
        }
        else {
            this.server = http.createServer(app);
        }
        server = this.server;
        app.set('port', port);
        server.listen(port);
        server.on('error', this.onError(this));
        server.on('listening', this.onListening(this));
        this.server = server;
    }
    /** This return the Object of the ServerApplication */
    ServerApplication.createServer = function (app) {
        return new ServerApplication(app_1.App);
    };
    /**
     * @param{string} val: It is port number in the string format
     * It is static method for the converting the string port into the interger.
     * If the port is invalid then it return the false
     */
    ServerApplication.normalizePort = function (val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    };
    /** This is called when the application is going to crash */
    ServerApplication.prototype.onError = function (thisPtr) {
        return function (error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind = typeof thisPtr.port === 'string'
                ? 'Pipe ' + thisPtr.port
                : 'Port ' + thisPtr.port;
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        };
    };
    /**
     * @method
     * This is called when the app start listen on the port.
     * when the method is called then the it log the port number of the application.
     */
    ServerApplication.prototype.onListening = function (thisPtr) {
        return function () {
            console.log('Application Started on ' + thisPtr.port + ' Port');
        };
    };
    return ServerApplication;
}());
ServerApplication.createServer(app_1.App);
