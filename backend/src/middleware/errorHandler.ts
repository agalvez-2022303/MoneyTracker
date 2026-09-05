import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = new AppError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  next(error);
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  console.error('[error]', error);
  res.status(500).json({ error: 'Error interno del servidor' });
}