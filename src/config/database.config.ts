import { createConnection, ConnectionOptions, DriverOptions } from 'typeorm';
import { join as pathJoin } from 'path';
import { assign } from 'lodash';
/**
 * This is Database Configuration.
 */
export namespace DatabaseConfiguration {
    /**
     * This is for initialize the database and return the promise contains the the connection object
     */
    export function DatabaseInit() {
        return createConnection(DatabaseConfig());
    }

    /**
     * This configuration which is required by the createConnection function
     */
    export function DatabaseConfig(): ConnectionOptions {
        return assign({}, DatabaseDriverConfig(), {
            entities: [
                pathJoin('..' , 'entity' , '**/*.js')
            ],
            autoSchemaSync: (process.env.AUTO_SCHEMA_SYNC === 'true'),
            logging: {
                logQueries: (process.env.QUERY === 'true')
            }
        }) as any;
    }

    /**
     * This is the driver option according to your driver
     */
    export function DatabaseDriverConfig(): any {
        // TODO(Omkar Yadav): load this config from the json file or any other env file
        const driverOptions = {
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
}
