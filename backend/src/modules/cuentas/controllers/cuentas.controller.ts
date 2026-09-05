import { Request, Response } from 'express';
import * as cuentasService from '../services/cuentas.service';
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

function validarTipo(tipo: unknown): cuentasService.TipoCuenta {
  if (typeof tipo !== 'string' || !cuentasService.TIPOS_CUENTA.includes(tipo as never)) {
    throw new BadRequestError(`El campo "tipo" debe ser uno de: ${cuentasService.TIPOS_CUENTA.join(', ')}`);
  }
  return tipo as cuentasService.TipoCuenta;
}

function validarDescripcion(descripcion: unknown): string | null {
  if (descripcion === undefined) return undefined as never;
  if (descripcion === null || typeof descripcion !== 'string') {
    throw new BadRequestError('El campo "descripcion" debe ser un texto');
  }
  return descripcion.trim() === '' ? null : descripcion.trim();
}

function validarMonto(monto: unknown, campo: string, permitirNegativos = false): number {
  const numero = Number(monto);
  if (typeof monto !== 'number' && typeof monto !== 'string') {
    throw new BadRequestError(`El campo "${campo}" debe ser un número`);
  }
  if (!Number.isFinite(numero)) {
    throw new BadRequestError(`El campo "${campo}" debe ser un número válido`);
  }
  if (!permitirNegativos && numero < 0) {
    throw new BadRequestError(`El campo "${campo}" no puede ser negativo`);
  }
  return numero;
}

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const cuentas = await cuentasService.listar(usuarioId(req));
  res.json({ cuentas });
});

export const obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const cuenta = await cuentasService.obtenerPorId(usuarioId(req), id);
  res.json({ cuenta });
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const cuenta = await cuentasService.crear(usuarioId(req), {
    nombre: validarNombre(req.body.nombre),
    tipo: validarTipo(req.body.tipo),
    descripcion: validarDescripcion(req.body.descripcion),
    montoInicial: req.body.monto_inicial !== undefined ? validarMonto(req.body.monto_inicial, 'monto_inicial') : undefined,
  });
  res.status(201).json({ cuenta });
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const cuenta = await cuentasService.actualizar(usuarioId(req), id, {
    nombre: req.body.nombre !== undefined ? validarNombre(req.body.nombre) : undefined,
    tipo: req.body.tipo !== undefined ? validarTipo(req.body.tipo) : undefined,
    descripcion: req.body.descripcion !== undefined ? validarDescripcion(req.body.descripcion) : undefined,
    montoActual: req.body.monto_actual !== undefined ? validarMonto(req.body.monto_actual, 'monto_actual') : undefined,
  });
  res.json({ cuenta });
});

export const eliminar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  await cuentasService.eliminar(usuarioId(req), id);
  res.status(204).send();
});