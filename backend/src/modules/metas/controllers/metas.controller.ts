import { Request, Response } from 'express';
import * as metasService from '../services/metas.service';
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

function validarMonto(monto: unknown, campo: string, mayorQueCero = false): number {
  const numero = Number(monto);
  if (typeof monto !== 'number' && typeof monto !== 'string') {
    throw new BadRequestError(`El campo "${campo}" debe ser un número`);
  }
  if (!Number.isFinite(numero)) {
    throw new BadRequestError(`El campo "${campo}" debe ser un número válido`);
  }
  if (mayorQueCero ? numero <= 0 : numero < 0) {
    throw new BadRequestError(mayorQueCero ? `El campo "${campo}" debe ser mayor a 0` : `El campo "${campo}" no puede ser negativo`);
  }
  return numero;
}

function validarPrioridad(prioridad: unknown): metasService.PrioridadMeta {
  if (typeof prioridad !== 'string' || !metasService.PRIORIDADES.includes(prioridad as never)) {
    throw new BadRequestError(`El campo "prioridad" debe ser uno de: ${metasService.PRIORIDADES.join(', ')}`);
  }
  return prioridad as metasService.PrioridadMeta;
}

function validarTextoOpcional(valor: unknown, campo: string): string | null {
  if (valor === undefined || valor === null) return null;
  if (typeof valor !== 'string') {
    throw new BadRequestError(`El campo "${campo}" debe ser un texto`);
  }
  return valor.trim() === '' ? null : valor.trim();
}

function validarFechaLimite(fechaLimite: unknown): string | null {
  if (fechaLimite === undefined || fechaLimite === null || fechaLimite === '') return null;
  if (typeof fechaLimite !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fechaLimite)) {
    throw new BadRequestError('El campo "fecha_limite" debe tener formato YYYY-MM-DD');
  }
  const date = new Date(`${fechaLimite}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestError('El campo "fecha_limite" debe ser una fecha válida');
  }
  return fechaLimite;
}

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const metas = await metasService.listar(usuarioId(req));
  res.json({ metas });
});

export const obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const meta = await metasService.obtenerPorId(usuarioId(req), id);
  res.json({ meta });
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const meta = await metasService.crear(usuarioId(req), {
    nombre: validarNombre(req.body.nombre),
    cantidadObjetivo: validarMonto(req.body.cantidad_objetivo, 'cantidad_objetivo', true),
    montoInicial: req.body.monto_inicial !== undefined ? validarMonto(req.body.monto_inicial, 'monto_inicial') : undefined,
    prioridad: req.body.prioridad !== undefined ? validarPrioridad(req.body.prioridad) : undefined,
    descripcion: validarTextoOpcional(req.body.descripcion, 'descripcion'),
    icono: validarTextoOpcional(req.body.icono, 'icono'),
    fechaLimite: validarFechaLimite(req.body.fecha_limite),
  });
  res.status(201).json({ meta });
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const meta = await metasService.actualizar(usuarioId(req), id, {
    nombre: req.body.nombre !== undefined ? validarNombre(req.body.nombre) : undefined,
    cantidadObjetivo: req.body.cantidad_objetivo !== undefined ? validarMonto(req.body.cantidad_objetivo, 'cantidad_objetivo', true) : undefined,
    montoInicial: req.body.monto_inicial !== undefined ? validarMonto(req.body.monto_inicial, 'monto_inicial') : undefined,
    prioridad: req.body.prioridad !== undefined ? validarPrioridad(req.body.prioridad) : undefined,
    descripcion: req.body.descripcion !== undefined ? validarTextoOpcional(req.body.descripcion, 'descripcion') : undefined,
    icono: req.body.icono !== undefined ? validarTextoOpcional(req.body.icono, 'icono') : undefined,
    fechaLimite: req.body.fecha_limite !== undefined ? validarFechaLimite(req.body.fecha_limite) : undefined,
  });
  res.json({ meta });
});

export const eliminar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  await metasService.eliminar(usuarioId(req), id);
  res.status(204).send();
});