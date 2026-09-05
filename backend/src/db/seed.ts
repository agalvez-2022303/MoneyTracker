import bcrypt from 'bcrypt';
import { query } from '../config/db';
import { env } from '../config/env';

const BCRYPT_ROUNDS = 10;

export async function seedAdminUser(): Promise<boolean> {
  if (!env.adminEmail || !env.adminPassword) {
    console.warn('[db] No se definieron ADMIN_EMAIL/ADMIN_PASSWORD en el entorno; no se creará el admin inicial');
    return false;
  }

  const { rows } = await query('SELECT 1 FROM usuarios WHERE email = $1', [env.adminEmail]);
  if (rows.length > 0) return false;

  const passwordHash = await bcrypt.hash(env.adminPassword, BCRYPT_ROUNDS);
  await query('INSERT INTO usuarios (email, password_hash, rol) VALUES ($1, $2, $3)', [
    env.adminEmail,
    passwordHash,
    'admin',
  ]);
  console.log(`[db] Usuario admin inicial creado: ${env.adminEmail}`);
  return true;
}