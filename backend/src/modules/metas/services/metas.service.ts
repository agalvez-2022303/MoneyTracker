import * as metaModel from '../models/meta.model';
import { BadRequestError, NotFoundError } from '../../../utils/errors';
import { toNumber } from '../../../utils/http';

export const PRIORIDADES: metaModel.PrioridadMeta[] = ['alta', 'media', 'baja'];

export type PrioridadMeta = metaModel.PrioridadMeta;

export interface MetaPublica {
  id: number;
  nombre: string;
  cantidadObjetivo: number;
  montoInicial: number;
  prioridad: metaModel.PrioridadMeta;
  descripcion: string | null;
  icono: string | null;
  fechaLimite: string | null;
  montoActual: number;
  progreso: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearMeta {
  nombre: string;
  cantidadObjetivo: number;
  montoInicial?: number;
  prioridad?: metaModel.PrioridadMeta;
  descripcion?: string | null;
  icono?: string | null;
  fechaLimite?: string | null;
}

export interface ActualizarMetaDatos {
  nombre?: string;
  cantidadObjetivo?: number;
  montoInicial?: number;
  prioridad?: metaModel.PrioridadMeta;
  descripcion?: string | null;
  icono?: string | null;
  fechaLimite?: string | null;
}

export function toMetaPublica(row: metaModel.MetaRow): MetaPublica {
  const cantidadObjetivo = toNumber(row.cantidad_objetivo);
  const montoActual = toNumber(row.monto_actual);
  const progreso = cantidadObjetivo > 0 ? Math.min(Math.round((montoActual / cantidadObjetivo) * 10000) / 100, 100) : 0;
  return {
    id: row.id,
    nombre: row.nombre,
    cantidadObjetivo,
    montoInicial: toNumber(row.monto_inicial),
    prioridad: row.prioridad,
    descripcion: row.descripcion,
    icono: row.icono,
    fechaLimite: row.fecha_limite,
    montoActual,
    progreso,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listar(usuarioId: number): Promise<MetaPublica[]> {
  const rows = await metaModel.findAllByUsuario(usuarioId);
  return rows.map(toMetaPublica);
}

export async function obtenerPorId(usuarioId: number, id: number): Promise<MetaPublica> {
  const row = await metaModel.findByIdAndUsuario(usuarioId, id);
  if (!row) throw new NotFoundError(`Meta ${id} no encontrada`);
  return toMetaPublica(row);
}

export async function crear(usuarioId: number, datos: CrearMeta): Promise<MetaPublica> {
  if (datos.cantidadObjetivo <= 0) {
    throw new BadRequestError('La cantidad objetivo debe ser mayor a 0');
  }
  const montoInicial = datos.montoInicial ?? 0;
  if (montoInicial < 0) {
    throw new BadRequestError('El monto inicial no puede ser negativo');
  }

  const row = await metaModel.create({
    usuarioId,
    nombre: datos.nombre,
    cantidadObjetivo: datos.cantidadObjetivo,
    montoInicial,
    prioridad: datos.prioridad ?? 'media',
    descripcion: datos.descripcion ?? null,
    icono: datos.icono ?? null,
    fechaLimite: datos.fechaLimite ?? null,
  });
  return toMetaPublica(row);
}

export async function actualizar(usuarioId: number, id: number, datos: ActualizarMetaDatos): Promise<MetaPublica> {
  await obtenerPorId(usuarioId, id);
  const row = await metaModel.update(id, {
    nombre: datos.nombre,
    cantidadObjetivo: datos.cantidadObjetivo,
    montoInicial: datos.montoInicial,
    prioridad: datos.prioridad,
    descripcion: datos.descripcion,
    icono: datos.icono,
    fechaLimite: datos.fechaLimite,
  });
  return toMetaPublica(row as metaModel.MetaRow);
}

export async function eliminar(usuarioId: number, id: number): Promise<void> {
  await obtenerPorId(usuarioId, id);
  await metaModel.remove(id);
}

export async function ajustarMontoActual(usuarioId: number, id: number, delta: number): Promise<number> {
  const row = await metaModel.adjustMonto(usuarioId, id, delta);
  if (!row) throw new NotFoundError(`Meta ${id} no encontrada`);
  return toNumber(row.monto_actual);
}