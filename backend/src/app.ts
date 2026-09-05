import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './modules/auth/routes/auth.routes';
import usuariosRoutes from './modules/usuarios/routes/usuarios.routes';
import cuentasRoutes from './modules/cuentas/routes/cuentas.routes';
import metasRoutes from './modules/metas/routes/metas.routes';
import transaccionesRoutes from './modules/transacciones/routes/transacciones.routes';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): express.Express {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/usuarios', usuariosRoutes);
  app.use('/api/cuentas', cuentasRoutes);
  app.use('/api/metas', metasRoutes);
  app.use('/api/transacciones', transaccionesRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}