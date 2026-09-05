import { Request, Response } from 'express';
import * as usuariosService from '../services/usuarios.service';
import { asyncHandler, parsePositiveInt } from '../../../utils/http';
import { BadRequestError } from '../../../utils/errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ['admin', 'cliente'];

function validarEmail(email: unknown): string {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw new BadRequestError('El campo "email" debe ser un correo válido');
  }
  return email.toLowerCase().trim();
}

function validarPassword(password: unknown): string {
  if (typeof password !== 'string' || password.length < 6) {
    throw new BadRequestError('El campo "password" debe tener al menos 6 caracteres');
  }
  return password;
}

function validarRol(rol: unknown): 'admin' | 'cliente' | undefined {
  if (rol === undefined || rol === '') return undefined;
  if (typeof rol !== 'string' || !ROLES.includes(rol)) {
    throw new BadRequestError('El campo "rol" debe ser "admin" o "cliente"');
  }
  return rol as 'admin' | 'cliente';
}

export const listar = asyncHandler(async (_req: Request, res: Response) => {
  const usuarios = await usuariosService.listar();
  res.json({ usuarios });
});

export const obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const usuario = await usuariosService.obtenerPorId(id);
  res.json({ usuario });
});

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await usuariosService.crear({
    email: validarEmail(req.body.email),
    password: validarPassword(req.body.password),
    rol: validarRol(req.body.rol),
  });
  res.status(201).json({ usuario });
});

export const actualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  const usuario = await usuariosService.actualizar(id, {
    email: req.body.email !== undefined ? validarEmail(req.body.email) : undefined,
    password: req.body.password !== undefined ? validarPassword(req.body.password) : undefined,
    rol: validarRol(req.body.rol),
  });
  res.json({ usuario });
});

export const eliminar = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveInt(req.params.id, 'id');
  await usuariosService.eliminar(id);
  res.status(204).send();
});