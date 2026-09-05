import { query } from '../../../config/db';

export type PrioridadMeta = 'alta' | 'media' | 'baja';

export interface MetaRow {
  id: number;
  usuario_id: number;
  nombre: string;
  cantidad_objetivo: string;
  monto_inicial: string;
  prioridad: PrioridadMeta;
  descripcion: string | null;
  icono: string | null;
  fecha_limite: string | null;
  monto_actual: string;
  created_at: Date;
  updated_at: Date;
}

export interface NuevaMeta {
  usuarioId: number;
  nombre: string;
  cantidadObjetivo: number;
  montoInicial: number;
  prioridad: PrioridadMeta;
  descripcion?: string | null;
  icono?: string | null;
  fechaLimite?: string | null;
}

export interface ActualizarMeta {
  nombre?: string;
  cantidadObjetivo?: number;
  montoInicial?: number;
  prioridad?: PrioridadMeta;
  descripcion?: string | null;
  icono?: string | null;
  fechaLimite?: string | null;
}

export async function findAllByUsuario(usuarioId: number): Promise<MetaRow[]> {
  const { rows } = await query<MetaRow>('SELECT * FROM metas WHERE usuario_id = $1 ORDER BY id', [usuarioId]);
  return rows;
}

export async function findByIdAndUsuario(usuarioId: number, id: number): Promise<MetaRow | undefined> {
  const { rows } = await query<MetaRow>('SELECT * FROM metas WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
  return rows[0];
}

export async function create(data: NuevaMeta): Promise<MetaRow> {
  const { rows } = await query<MetaRow>(
    `INSERT INTO metas (usuario_id, nombre, cantidad_objetivo, monto_inicial, prioridad, descripcion, icono, fecha_limite, monto_actual)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $4)
     RETURNING *`,
    [
      data.usuarioId,
      data.nombre,
      data.cantidadObjetivo,
      data.montoInicial,
      data.prioridad,
      data.descripcion ?? null,
      data.icono ?? null,
      data.fechaLimite ?? null,
    ],
  );
  return rows[0];
}

export async function update(id: number, datos: ActualizarMeta): Promise<MetaRow | undefined> {
  const sets: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (datos.nombre !== undefined) {
    sets.push(`nombre = $${index++}`);
    values.push(datos.nombre);
  }
  if (datos.cantidadObjetivo !== undefined) {
    sets.push(`cantidad_objetivo = $${index++}`);
    values.push(datos.cantidadObjetivo);
  }
  if (datos.montoInicial !== undefined) {
    sets.push(`monto_inicial = $${index++}`);
    values.push(datos.montoInicial);
  }
  if (datos.prioridad !== undefined) {
    sets.push(`prioridad = $${index++}`);
    values.push(datos.prioridad);
  }
  if (datos.descripcion !== undefined) {
    sets.push(`descripcion = $${index++}`);
    values.push(datos.descripcion);
  }
  if (datos.icono !== undefined) {
    sets.push(`icono = $${index++}`);
    values.push(datos.icono);
  }
  if (datos.fechaLimite !== undefined) {
    sets.push(`fecha_limite = $${index++}`);
    values.push(datos.fechaLimite);
  }

  if (sets.length === 0) return undefined;

  values.push(id);
  const { rows } = await query<MetaRow>(
    `UPDATE metas SET ${sets.join(', ')}, updated_at = now() WHERE id = $${index} RETURNING *`,
    values,
  );
  return rows[0];
}

export async function adjustMonto(usuarioId: number, id: number, delta: number): Promise<MetaRow | undefined> {
  const { rows } = await query<MetaRow>(
    `UPDATE metas
     SET monto_actual = monto_actual + $1, updated_at = now()
     WHERE id = $2 AND usuario_id = $3
     RETURNING *`,
    [delta, id, usuarioId],
  );
  return rows[0];
}

export async function remove(id: number): Promise<boolean> {
  const result = await query('DELETE FROM metas WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}