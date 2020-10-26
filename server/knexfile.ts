import { Config } from 'knex';
import { resolve } from 'path';

const databasePath = (...pathSegments: string[]) => {
  return resolve(__dirname, 'src', 'database', ...pathSegments);
}

const config: Config = {
  client: 'sqlite3',
  connection: {
    filename: databasePath('database.sqlite')
  },
  migrations: {
    directory: databasePath('migrations'),
  },
  seeds: {
    directory: databasePath('seeds'),
  },
  useNullAsDefault: true,
};

export = config;
