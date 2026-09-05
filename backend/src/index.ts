import { createApp } from './app';
import { bootstrapDatabase } from './db/bootstrap';
import { pool } from './config/db';
import { env } from './config/env';

async function main(): Promise<void> {
  await bootstrapDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[server] Money Tracker API escuchando en http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error('[server] Error al iniciar:', error);
  process.exit(1);
});

function cerrarGraceful(): void {
  pool.end().finally(() => process.exit(0));
}

process.on('SIGINT', cerrarGraceful);
process.on('SIGTERM', cerrarGraceful);