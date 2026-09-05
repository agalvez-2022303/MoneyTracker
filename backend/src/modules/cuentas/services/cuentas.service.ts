import * as cuentaModel from '../models/cuenta.model';
import { BadRequestError, NotFoundError } from '../../../utils/errors';
import { toNumber } from '../../../utils/http';

export const TIPOS_CUENTA: cuentaModel.TipoCuenta[] = ['efectivo', 'tarjeta', 'cripto', 'otro'];

export type TipoCuenta = cuentaModel.TipoCuenta;

export interface CuentaPublica {
  id: number;
  nombre: string;
  tipo: cuentaModel.TipoCuenta;
  descripcion: string | null;
  montoActual: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearCuenta {
  nombre: string;
  tipo: cuentaModel.TipoCuenta;
  descripcion?: string | null;
  montoInicial?: number;
}

export interface ActualizarCuentaDatos {
  nombre?: string;
  tipo?: cuentaModel.TipoCuenta;
  descripcion?: string | null;
  montoActual?: number;
}

export function toCuentaPublica(row: cuentaModel.CuentaRow): CuentaPublica {
  return {
    id: row.id,
    nombre: row.nombre,
    tipo: row.tipo,
    descripcion: row.descripcion,
    montoActual: toNumber(row.monto_actual),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listar(usuarioId: number): Promise<CuentaPublica[]> {
  const rows = await cuentaModel.findAllByUsuario(usuarioId);
  return rows.map(toCuentaPublica);
}

export async function obtenerPorId(usuarioId: number, id: number): Promise<CuentaPublica> {
  const row = await cuentaModel.findByIdAndUsuario(usuarioId, id);
  if (!row) throw new NotFoundError(`Cuenta ${id} no encontrada`);
  return toCuentaPublica(row);
}

export async function crear(usuarioId: number, datos: CrearCuenta): Promise<CuentaPublica> {
  const montoInicial = datos.montoInicial ?? 0;
  if (montoInicial < 0) throw new BadRequestError('El monto inicial no puede ser negativo');

  const row = await cuentaModel.create({
    usuarioId,
    nombre: datos.nombre,
    tipo: datos.tipo,
    descripcion: datos.descripcion ?? null,
    montoInicial,
  });
  return toCuentaPublica(row);
}

export async function actualizar(usuarioId: number, id: number, datos: ActualizarCuentaDatos): Promise<CuentaPublica> {
  await obtenerPorId(usuarioId, id);
  const row = await cuentaModel.update(id, {
    nombre: datos.nombre,
    tipo: datos.tipo,
    descripcion: datos.descripcion,
    montoActual: datos.montoActual,
  });
  return toCuentaPublica(row as cuentaModel.CuentaRow);
}

export async function eliminar(usuarioId: number, id: number): Promise<void> {
  await obtenerPorId(usuarioId, id);
  await cuentaModel.remove(id);
}

export async function ajustarSaldo(usuarioId: number, id: number, delta: number): Promise<number> {
  const row = await cuentaModel.adjustMonto(usuarioId, id, delta);
  if (!row) throw new NotFoundError(`Cuenta ${id} no encontrada`);
  return toNumber(row.monto_actual);
}