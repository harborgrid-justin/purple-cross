import { Router } from 'express';
import timeBlockController from '../controllers/timeBlock.controller';

const router = Router();

router.post('/', timeBlockController.create);
router.get('/', timeBlockController.getAll);
router.get('/:id', timeBlockController.getById);
router.put('/:id', timeBlockController.update);
router.delete('/:id', timeBlockController.delete);

export default router;
