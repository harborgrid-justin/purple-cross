import { Router } from 'express';
import documentTemplateController from '../controllers/document-template.controller';

const router = Router();

router.post('/', documentTemplateController.create);
router.get('/', documentTemplateController.getAll);
router.get('/:id', documentTemplateController.getById);
router.put('/:id', documentTemplateController.update);
router.delete('/:id', documentTemplateController.delete);
router.post('/:id/use', documentTemplateController.incrementUsage);
router.post('/signatures', documentTemplateController.signDocument);
router.get('/documents/:documentId/signatures', documentTemplateController.getDocumentSignatures);
router.post('/workflows', documentTemplateController.createWorkflow);
router.post('/workflows/:workflowId/advance', documentTemplateController.advanceWorkflow);

export default router;
