import { Router } from 'express';
import patientRelationshipController from '../controllers/patient-relationship.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createRelationshipSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  relatedPatientId: Joi.string().uuid().required(),
  relationshipType: Joi.string().required(),
  notes: Joi.string().optional(),
});

const updateRelationshipSchema = Joi.object({
  patientId: Joi.string().uuid().optional(),
  relatedPatientId: Joi.string().uuid().optional(),
  relationshipType: Joi.string().optional(),
  notes: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const patientIdParamSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /patient-relationships:
 *   post:
 *     tags: [Patient Relationships]
 *     summary: Create a relationship between two patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, relatedPatientId, relationshipType]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               relatedPatientId: { type: string, format: uuid }
 *               relationshipType: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Relationship created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /patient-relationships/{id}:
 *   get:
 *     tags: [Patient Relationships]
 *     summary: Get a relationship by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Relationship found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Relationship not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Patient Relationships]
 *     summary: Update a relationship
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
 *               patientId: { type: string, format: uuid }
 *               relatedPatientId: { type: string, format: uuid }
 *               relationshipType: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Relationship updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Relationship not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Patient Relationships]
 *     summary: Delete a relationship
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Relationship deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Relationship not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /patient-relationships/patient/{patientId}:
 *   get:
 *     tags: [Patient Relationships]
 *     summary: List all relationships for a patient
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Relationships for the patient }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /patient-relationships/patient/{patientId}/family:
 *   get:
 *     tags: [Patient Relationships]
 *     summary: Get the family tree for a patient
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Patient family graph }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/', validate(createRelationshipSchema), patientRelationshipController.create);
router.get('/:id', validateParams(idParamSchema), patientRelationshipController.getById);
router.get(
  '/patient/:patientId',
  validateParams(patientIdParamSchema),
  patientRelationshipController.getPatientRelationships
);
router.get(
  '/patient/:patientId/family',
  validateParams(patientIdParamSchema),
  patientRelationshipController.getPatientFamily
);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateRelationshipSchema),
  patientRelationshipController.update
);
router.delete('/:id', validateParams(idParamSchema), patientRelationshipController.delete);

export default router;
