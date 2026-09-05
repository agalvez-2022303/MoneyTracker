import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, dashboardController.obtener);

export default router;