import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const poolConfig: PoolConfig = {
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
};

export const pool = new Pool(poolConfig);

export function createAdminPool(): Pool {
  return new Pool({
    ...poolConfig,
    database: 'postgres',
  });
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params as never[]);
}