import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import { createAdminPool, pool } from '../config/db';
import { env } from '../config/env';
import { seedAdminUser } from './seed';

function assertSafeIdentifier(name: string): void {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Nombre de base de datos inválido: "${name}"`);
  }
}

async function databaseExists(client: Client, databaseName: string): Promise<boolean> {
  const { rows } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [databaseName]);
  return rows.length > 0;
}

export async function bootstrapDatabase(): Promise<void> {
  const databaseName = env.db.database;
  assertSafeIdentifier(databaseName);

  const adminPool = createAdminPool();
  const adminClient = await adminPool.connect();
  try {
    if (await databaseExists(adminClient, databaseName)) {
      console.log(`[db] La base de datos "${databaseName}" ya existe`);
    } else {
      await adminClient.query(`CREATE DATABASE "${databaseName}" ENCODING 'UTF8'`);
      console.log(`[db] Base de datos "${databaseName}" creada`);
    }
  } finally {
    adminClient.release();
    await adminPool.end();
  }

  const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('[db] Tablas verificadas/creadas satisfactoriamente');

  await seedAdminUser();
}

if (require.main === module) {
  bootstrapDatabase()
    .then(() => {
      console.log('[db] Bootstrap completado');
      return pool.end();
    })
    .catch((error) => {
      console.error('[db] Error en el bootstrap:', error);
      process.exit(1);
    });
}