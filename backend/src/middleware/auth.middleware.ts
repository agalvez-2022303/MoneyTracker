import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  userId?: number;
  userRol?: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token;
  if (!token) {
    return next(new UnauthorizedError('No autenticado: falta el access token'));
  }

  try {
    const payload = jwt.verify(token, env.auth.jwtAccessSecret) as JwtPayload;
    if (typeof payload.sub !== 'number') {
      return next(new UnauthorizedError('Access token inválido'));
    }
    (req as AuthRequest).userId = payload.sub;
    (req as AuthRequest).userRol = typeof payload.rol === 'string' ? payload.rol : 'cliente';
    next();
  } catch {
    return next(new UnauthorizedError('Access token inválido o expirado'));
  }
}