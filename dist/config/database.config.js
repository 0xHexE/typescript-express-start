"use strict";
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var path_1 = require("path");
var lodash_1 = require("lodash");
/**
 * This is Database Configuration.
 */
var DatabaseConfiguration;
(function (DatabaseConfiguration) {
    /**
     * This is for initialize the database and return the promise contains the the connection object
     */
    function DatabaseInit() {
        return typeorm_1.createConnection(DatabaseConfig());
    }
    DatabaseConfiguration.DatabaseInit = DatabaseInit;
    /**
     * This configuration which is required by the createConnection function
     */
    function DatabaseConfig() {
        return lodash_1.assign({}, DatabaseDriverConfig(), {
            entities: [
                path_1.join('..', 'entity', '**/*.js')
            ],
            autoSchemaSync: (process.env.AUTO_SCHEMA_SYNC === 'true'),
            logging: {
                logQueries: (process.env.QUERY === 'true')
            }
        });
    }
    DatabaseConfiguration.DatabaseConfig = DatabaseConfig;
    /**
     * This is the driver option according to your driver
     */
    function DatabaseDriverConfig() {
        // TODO(Omkar Yadav): load this config from the json file or any other env file
        var driverOptions = {
            'development': {
                type: 'postgres',
                database: process.env.DB_NAME || 'dev_db_vts',
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'omkarYADAV',
                host: process.env.DB_HOST || '127.0.0.1'
            },
            'production': {
                type: 'postgres',
                database: process.env.DB_NAME,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST
            }
        };
        return driverOptions[process.env.NODE_ENV] || driverOptions['development'];
    }
    DatabaseConfiguration.DatabaseDriverConfig = DatabaseDriverConfig;
})(DatabaseConfiguration = exports.DatabaseConfiguration || (exports.DatabaseConfiguration = {}));
