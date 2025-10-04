import { Router } from 'express';
import waitlistController from '../controllers/waitlist.controller';

const router = Router();

router.post('/', waitlistController.create);
router.get('/', waitlistController.getAll);
router.get('/:id', waitlistController.getById);
router.put('/:id', waitlistController.update);
router.delete('/:id', waitlistController.delete);
router.post('/:id/notify', waitlistController.notify);
router.post('/:id/book', waitlistController.book);
router.post('/:id/cancel', waitlistController.cancel);

export default router;
