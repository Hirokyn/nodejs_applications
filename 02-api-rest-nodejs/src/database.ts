import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'pg' 
      ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    tableName: 'knex_migrations',
    directory: './database/migrations'
  }
}

export const knex = setupKnex(config)