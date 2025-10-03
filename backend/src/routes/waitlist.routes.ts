import { Router } from 'express';
import waitlistController from '../controllers/waitlist.controller';

const router = Router();

router.post('/', waitlistController.create);
router.get('/', waitlistController.getAll);
router.get('/:id', waitlistController.getById);
router.post('/:id/notify', waitlistController.notify);
router.post('/:id/book', waitlistController.book);
router.post('/:id/cancel', waitlistController.cancel);
router.delete('/:id', waitlistController.delete);

export default router;
