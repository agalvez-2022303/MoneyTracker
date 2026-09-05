import { Router } from 'express';
import * as cuentasController from '../controllers/cuentas.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', cuentasController.listar);
router.get('/:id', cuentasController.obtenerPorId);
router.post('/', cuentasController.crear);
router.put('/:id', cuentasController.actualizar);
router.delete('/:id', cuentasController.eliminar);

export default router;