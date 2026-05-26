import { Router } from 'express';
import documentController from '../controllers/document.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createDocumentSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required(),
  fileSize: Joi.number().integer().min(0).required(),
  filePath: Joi.string().required(),
  entityType: Joi.string().required(),
  entityId: Joi.string().uuid().required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
});

const updateDocumentSchema = Joi.object({
  description: Joi.string().optional(),
  category: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /documents:
 *   get:
 *     tags: [Documents]
 *     summary: List documents
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: entityType
 *         schema: { type: string }
 *       - in: query
 *         name: entityId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Paginated list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Documents]
 *     summary: Register a document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileName, fileType, fileSize, filePath, entityType, entityId, category]
 *             properties:
 *               fileName: { type: string }
 *               fileType: { type: string }
 *               fileSize: { type: integer, minimum: 0 }
 *               filePath: { type: string }
 *               entityType: { type: string }
 *               entityId: { type: string, format: uuid }
 *               category: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Document created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /documents/{id}:
 *   get:
 *     tags: [Documents]
 *     summary: Get a document by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Document found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Documents]
 *     summary: Update document metadata
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description: { type: string }
 *               category: { type: string }
 *     responses:
 *       200: { description: Document updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Documents]
 *     summary: Delete a document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Document deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createDocumentSchema), documentController.create);
router.get('/', documentController.getAll);
router.get('/:id', validateParams(idParamSchema), documentController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateDocumentSchema),
  documentController.update
);
router.delete('/:id', validateParams(idParamSchema), documentController.delete);

export default router;
