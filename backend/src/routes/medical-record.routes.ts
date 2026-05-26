import { Router } from 'express';
import medicalRecordController from '../controllers/medical-record.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createMedicalRecordSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  veterinarianId: Joi.string().uuid().required(),
  visitDate: Joi.date().required(),
  chiefComplaint: Joi.string().required(),
  diagnosis: Joi.string().optional(),
  treatment: Joi.string().optional(),
  notes: Joi.string().optional(),
  vitalSigns: Joi.object().optional(),
});

const updateMedicalRecordSchema = Joi.object({
  visitDate: Joi.date().optional(),
  chiefComplaint: Joi.string().optional(),
  diagnosis: Joi.string().optional(),
  treatment: Joi.string().optional(),
  notes: Joi.string().optional(),
  vitalSigns: Joi.object().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /medical-records:
 *   get:
 *     tags: [Medical Records]
 *     summary: List medical records
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: patientId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Paginated list of medical records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Medical Records]
 *     summary: Create a medical record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, veterinarianId, visitDate, chiefComplaint]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               veterinarianId: { type: string, format: uuid }
 *               visitDate: { type: string, format: date-time }
 *               chiefComplaint: { type: string }
 *               diagnosis: { type: string }
 *               treatment: { type: string }
 *               notes: { type: string }
 *               vitalSigns: { type: object }
 *     responses:
 *       201: { description: Medical record created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /medical-records/{id}:
 *   get:
 *     tags: [Medical Records]
 *     summary: Get a medical record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Medical record found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Medical record not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Medical Records]
 *     summary: Update a medical record
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
 *               visitDate: { type: string, format: date-time }
 *               chiefComplaint: { type: string }
 *               diagnosis: { type: string }
 *               treatment: { type: string }
 *               notes: { type: string }
 *               vitalSigns: { type: object }
 *     responses:
 *       200: { description: Medical record updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Medical record not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Medical Records]
 *     summary: Delete a medical record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Medical record deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Medical record not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createMedicalRecordSchema), medicalRecordController.create);
router.get('/', medicalRecordController.getAll);
router.get('/:id', validateParams(idParamSchema), medicalRecordController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateMedicalRecordSchema),
  medicalRecordController.update
);
router.delete('/:id', validateParams(idParamSchema), medicalRecordController.delete);

export default router;
