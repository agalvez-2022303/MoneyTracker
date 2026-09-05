import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { asyncHandler } from '../../../utils/http';
import type { AuthRequest } from '../../../middleware/auth.middleware';

export const obtener = asyncHandler(async (req: Request, res: Response) => {
  const usuarioId = (req as AuthRequest).userId as number;
  const dashboard = await dashboardService.obtenerDashboard(usuarioId);
  res.json({ dashboard });
});