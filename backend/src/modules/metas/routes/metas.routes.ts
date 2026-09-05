import { Router } from 'express';
import * as metasController from '../controllers/metas.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', metasController.listar);
router.get('/:id', metasController.obtenerPorId);
router.post('/', metasController.crear);
router.put('/:id', metasController.actualizar);
router.delete('/:id', metasController.eliminar);

export default router;