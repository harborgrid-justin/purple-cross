import { Router } from 'express';
import breedInfoController from '../controllers/breed-info.controller';

const router = Router();

router.post('/', breedInfoController.create);
router.get('/', breedInfoController.getAll);
router.get('/breed/:breed', breedInfoController.getByBreed);
router.get('/:id', breedInfoController.getById);
router.put('/:id', breedInfoController.update);
router.delete('/:id', breedInfoController.delete);

export default router;
