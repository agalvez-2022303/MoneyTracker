import { query } from '../../../config/db';

export type TipoCuenta = 'efectivo' | 'tarjeta' | 'cripto' | 'otro';

export interface CuentaRow {
  id: number;
  usuario_id: number;
  nombre: string;
  tipo: TipoCuenta;
  descripcion: string | null;
  monto_actual: string;
  created_at: Date;
  updated_at: Date;
}

export interface NuevaCuenta {
  usuarioId: number;
  nombre: string;
  tipo: TipoCuenta;
  descripcion?: string | null;
  montoInicial: number;
}

export interface ActualizarCuenta {
  nombre?: string;
  tipo?: TipoCuenta;
  descripcion?: string | null;
  montoActual?: number;
}

export async function findAllByUsuario(usuarioId: number): Promise<CuentaRow[]> {
  const { rows } = await query<CuentaRow>('SELECT * FROM cuentas WHERE usuario_id = $1 ORDER BY id', [usuarioId]);
  return rows;
}

export async function findByIdAndUsuario(usuarioId: number, id: number): Promise<CuentaRow | undefined> {
  const { rows } = await query<CuentaRow>('SELECT * FROM cuentas WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
  return rows[0];
}

export async function create(data: NuevaCuenta): Promise<CuentaRow> {
  const { rows } = await query<CuentaRow>(
    `INSERT INTO cuentas (usuario_id, nombre, tipo, descripcion, monto_actual)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.usuarioId, data.nombre, data.tipo, data.descripcion ?? null, data.montoInicial],
  );
  return rows[0];
}

export async function update(id: number, datos: ActualizarCuenta): Promise<CuentaRow | undefined> {
  const sets: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (datos.nombre !== undefined) {
    sets.push(`nombre = $${index++}`);
    values.push(datos.nombre);
  }
  if (datos.tipo !== undefined) {
    sets.push(`tipo = $${index++}`);
    values.push(datos.tipo);
  }
  if (datos.descripcion !== undefined) {
    sets.push(`descripcion = $${index++}`);
    values.push(datos.descripcion);
  }
  if (datos.montoActual !== undefined) {
    sets.push(`monto_actual = $${index++}`);
    values.push(datos.montoActual);
  }

  if (sets.length === 0) return undefined;

  values.push(id);
  const { rows } = await query<CuentaRow>(
    `UPDATE cuentas SET ${sets.join(', ')}, updated_at = now() WHERE id = $${index} RETURNING *`,
    values,
  );
  return rows[0];
}

export async function adjustMonto(usuarioId: number, id: number, delta: number): Promise<CuentaRow | undefined> {
  const { rows } = await query<CuentaRow>(
    `UPDATE cuentas
     SET monto_actual = monto_actual + $1, updated_at = now()
     WHERE id = $2 AND usuario_id = $3
     RETURNING *`,
    [delta, id, usuarioId],
  );
  return rows[0];
}

export async function remove(id: number): Promise<boolean> {
  const result = await query('DELETE FROM cuentas WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}