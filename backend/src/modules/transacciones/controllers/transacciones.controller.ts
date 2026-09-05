import { Request, Response } from 'express';
import * as transaccionesService from '../services/transacciones.service';
import { asyncHandler, parsePositiveInt } from '../../../utils/http';
import { BadRequestError } from '../../../utils/errors';
import type { AuthRequest } from '../../../middleware/auth.middleware';

function usuarioId(req: Request): number {
  return (req as AuthRequest).userId as number;
}

function validarNombre(nombre: unknown): string {
  if (typeof nombre !== 'string' || nombre.trim().length === 0) {
    throw new BadRequestError('El campo "nombre" es obligatorio');
  }
  return nombre.trim();
}

function validarTipo(tipo: unknown): transaccionesService.TipoTransaccion {
  if (typeof tipo !== 'string' || !transaccionesService.TIPOS_TRANSACCION.includes(tipo as never)) {
    throw new BadRequestError(`El campo "tipo" debe ser "ingreso" o "egreso"`);
  }
  return tipo as transaccionesService.TipoTransaccion;
}

function validarMonto(monto: unknown): number {
  const numero = Number(monto);
  if (typeof monto !== 'number' && typeof monto !== 'string') {
    throw new BadRequestError('El campo "monto_original" debe ser un número');
  }
  if (!Number.isFinite(numero) || numero <= 0) {
    throw new BadRequestError('El campo "monto_original" debe ser mayor a 0');
  }
  return numero;
}

function validarDestinoId(valor: unknown, campo: string): number | undefined {
  if (valor === undefined || valor === null || valor === '') return undefined;
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new BadRequestError(`El campo "${campo}" debe ser un id válido`);
  }
  return numero;
}

function validarTasa(tasa: unknown): number | undefined {
  if (tasa === undefined || tasa === null) return undefined;
  const numero = Number(tasa);
  if (!Number.isFinite(numero) || numero <= 0) {
    throw new BadRequestError('El campo "tasa_cambio_usada" debe ser mayor a 0');
  }
  return numero;
}

function validarTextoOpcional(valor: unknown, campo: string): string | null | undefined {
  if (valor === undefined) return undefined;
  if (valor === null) return null;
  if (typeof valor !== 'string') {
    throw new BadRequestError(`El campo "${campo}" debe ser un texto`);
  }
  return valor.trim() === '' ? null : valor.trim();
}

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const tipo = req.query.tipo as string | undefined;
  const limit = req.query.limit !== undefined ? parsePositiveInt(req.query.limit, 'limit') : undefined;

  const transacciones = await transaccionesService.listar(usuarioId(req), {
    tipo: tipo !== undefined ? validarTipo(tipo) : undefined,
    limit,
  });
  res.json({ transacciones });
});

export const obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const transaccion = await transaccionesService.obtenerPorId(usuarioId(req), id);
  res.json({ transaccion });
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const transaccion = await transaccionesService.crear(usuarioId(req), {
    nombre: validarNombre(req.body.nombre),
    tipo: validarTipo(req.body.tipo),
    montoOriginal: validarMonto(req.body.monto_original),
    cuentaId: validarDestinoId(req.body.cuenta_id, 'cuenta_id'),
    metaId: validarDestinoId(req.body.meta_id, 'meta_id'),
    monedaOriginal: req.body.moneda_original !== undefined ? String(req.body.moneda_original).toUpperCase() : undefined,
    tasaCambioUsada: validarTasa(req.body.tasa_cambio_usada),
    categoria: validarTextoOpcional(req.body.categoria, 'categoria') ?? 'otro',
    descripcion: validarTextoOpcional(req.body.descripcion, 'descripcion'),
  });
  res.status(201).json({ transaccion });
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const transaccion = await transaccionesService.actualizar(usuarioId(req), id, {
    nombre: req.body.nombre !== undefined ? validarNombre(req.body.nombre) : undefined,
    tipo: req.body.tipo !== undefined ? validarTipo(req.body.tipo) : undefined,
    montoOriginal: req.body.monto_original !== undefined ? validarMonto(req.body.monto_original) : undefined,
    cuentaId: req.body.cuenta_id !== undefined ? validarDestinoId(req.body.cuenta_id, 'cuenta_id') : undefined,
    metaId: req.body.meta_id !== undefined ? validarDestinoId(req.body.meta_id, 'meta_id') : undefined,
    monedaOriginal: req.body.moneda_original !== undefined ? String(req.body.moneda_original).toUpperCase() : undefined,
    tasaCambioUsada: req.body.tasa_cambio_usada !== undefined ? validarTasa(req.body.tasa_cambio_usada) : undefined,
    categoria: validarTextoOpcional(req.body.categoria, 'categoria') ?? undefined,
    descripcion: validarTextoOpcional(req.body.descripcion, 'descripcion'),
  });
  res.json({ transaccion });
});

export const eliminar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  await transaccionesService.eliminar(usuarioId(req), id);
  res.status(204).send();
});