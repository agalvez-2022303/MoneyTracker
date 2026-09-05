import { Router } from 'express';
import * as transaccionesController from '../controllers/transacciones.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', transaccionesController.listar);
router.get('/:id', transaccionesController.obtenerPorId);
router.post('/', transaccionesController.crear);
router.put('/:id', transaccionesController.actualizar);
router.delete('/:id', transaccionesController.eliminar);

export default router;