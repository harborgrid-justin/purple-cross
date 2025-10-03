import { Router } from 'express';
import clientPortalController from '../controllers/clientPortal.controller';

const router = Router();

router.post('/', clientPortalController.create);
router.post('/login', clientPortalController.login);
router.get('/:id', clientPortalController.getById);
router.put('/:id/password', clientPortalController.updatePassword);
router.post('/:id/2fa/enable', clientPortalController.enableTwoFactor);
router.post('/:id/2fa/disable', clientPortalController.disableTwoFactor);
router.delete('/:id', clientPortalController.delete);

export default router;
