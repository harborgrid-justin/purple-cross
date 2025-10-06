import { Router } from 'express';
import patientRelationshipController from '../controllers/patient-relationship.controller';

const router = Router();

router.post('/', patientRelationshipController.create);
router.get('/:id', patientRelationshipController.getById);
router.get('/patient/:patientId', patientRelationshipController.getPatientRelationships);
router.get('/patient/:patientId/family', patientRelationshipController.getPatientFamily);
router.put('/:id', patientRelationshipController.update);
router.delete('/:id', patientRelationshipController.delete);

export default router;
