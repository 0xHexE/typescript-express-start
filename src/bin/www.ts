#!/usr/bin/env node
import 'reflect-metadata';
import * as http from 'http';
import * as https from 'https';

import * as express from 'express';
import * as path from 'path';
const debug = require('debug')('test:server');
import { App } from '../app';
import * as fs from 'fs';
import * as dotenv from "dotenv";
import * as appRoot from 'app-root-path';

dotenv.config();

/**
 * @class
 * This is the class which is responsible for running the application.
 */

class ServerApplication {
    /** This return the Object of the ServerApplication */
    static createServer(app): ServerApplication {
        return new ServerApplication(App);
    }

    /**
     * @param{string} val: It is port number in the string format
     * It is static method for the converting the string port into the interger.
     * If the port is invalid then it return the false
     */
    static normalizePort(val: string) {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }

    /**
     * @constructor
     * @param {express.Application} app : This is the parameter for the express application you can reconfigure the application.
     * @param {number} port : This is port number where the application is going to run.
     * @param {http.Server} server this is the http application.
     */
    constructor(
        public app: express.Application = express(),
        public port = ServerApplication.normalizePort(process.env.HTTP_PORT || '80'),
        public server?,
        public httpServerApp = express(),
        public httpServer?
    ) {
        if (process.env.SSL_ENABLE === 'true') {
            this.port = ServerApplication.normalizePort(process.env.HTTPS_PORT || '443');
            port = ServerApplication.normalizePort(process.env.HTTPS_PORT || '443');

            httpServerApp.get('*', (req, res, next) => {
                res.redirect('https://' + req.headers.host + '/' + req.path);
            });

            this.httpServer = http.createServer(httpServerApp).listen(ServerApplication.normalizePort(process.env.HTTP_PORT || '80'));

            this.server = https.createServer({
                ca: fs.readFileSync(path.join(appRoot().toString(), 'certificates', 'vendor.cert'), 'utf-8'),
                cert: fs.readFileSync(path.join(appRoot().toString(), 'certificates', 'certificate.cert'), 'utf-8'),
                key: fs.readFileSync(path.join(appRoot().toString(), 'certificates', 'private.key')),
            }, app);
        } else {
            this.server = http.createServer(app);
        }

        server = this.server;
        app.set('port', port);
        server.listen(port);
        server.on('error', this.onError(this));
        server.on('listening', this.onListening(this));
        this.server = server;
    }

    /** This is called when the application is going to crash */
    private onError(thisPtr) {
        return (error) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            const bind = typeof thisPtr.port === 'string'
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
        }
    }

    /**
     * @method
     * This is called when the app start listen on the port.
     * when the method is called then the it log the port number of the application.
     */
    private onListening(thisPtr: this) {
        return () => {
            console.log('Application Started on ' + thisPtr.port + ' Port');
        }
    }
}

ServerApplication.createServer(App);
