import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';

export interface TokenUsuario {
  id: number;
  rol: 'admin' | 'cliente';
}

export function firmaAccessToken(usuario: TokenUsuario): string {
  return jwt.sign({ sub: usuario.id, rol: usuario.rol }, env.auth.jwtAccessSecret, {
    expiresIn: `${env.auth.accessTokenMinutes}m`,
  });
}

export function generarRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashRefreshToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}