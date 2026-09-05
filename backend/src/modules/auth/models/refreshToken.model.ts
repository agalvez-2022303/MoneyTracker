import { query } from '../../../config/db';

export interface RefreshTokenRow {
  id: number;
  usuario_id: number;
  token_hash: string;
  expires_at: Date;
  last_used_at: Date;
  created_at: Date;
}

export async function findByHash(tokenHash: string): Promise<RefreshTokenRow | undefined> {
  const { rows } = await query<RefreshTokenRow>('SELECT * FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
  return rows[0];
}

export async function create(data: {
  usuarioId: number;
  tokenHash: string;
  expiresAt: Date;
}): Promise<RefreshTokenRow> {
  const { rows } = await query<RefreshTokenRow>(
    `INSERT INTO refresh_tokens (usuario_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.usuarioId, data.tokenHash, data.expiresAt],
  );
  return rows[0];
}

export async function removeByHash(tokenHash: string): Promise<boolean> {
  const result = await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
  return (result.rowCount ?? 0) > 0;
}

export async function removeUserSessions(usuarioId: number): Promise<void> {
  await query('DELETE FROM refresh_tokens WHERE usuario_id = $1', [usuarioId]);
}