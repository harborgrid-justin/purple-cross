import { Router } from 'express';
import prescriptionController from '../controllers/prescription.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPrescriptionSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  medicationId: Joi.string().uuid().required(),
  prescribedById: Joi.string().uuid().required(),
  prescriptionDate: Joi.date().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  duration: Joi.string().required(),
  instructions: Joi.string().optional(),
  refills: Joi.number().integer().min(0).optional(),
});

const updatePrescriptionSchema = Joi.object({
  dosage: Joi.string().optional(),
  frequency: Joi.string().optional(),
  duration: Joi.string().optional(),
  instructions: Joi.string().optional(),
  refills: Joi.number().integer().min(0).optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: List prescriptions
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
 *         description: Paginated list of prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Prescriptions]
 *     summary: Create a prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, medicationId, prescribedById, prescriptionDate, dosage, frequency, duration]
 *             properties:
 *               patientId: { type: string, format: uuid }
 *               medicationId: { type: string, format: uuid }
 *               prescribedById: { type: string, format: uuid }
 *               prescriptionDate: { type: string, format: date-time }
 *               dosage: { type: string }
 *               frequency: { type: string }
 *               duration: { type: string }
 *               instructions: { type: string }
 *               refills: { type: integer, minimum: 0 }
 *     responses:
 *       201: { description: Prescription created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /prescriptions/{id}:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Get a prescription by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Prescription found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Prescription not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Prescriptions]
 *     summary: Update a prescription
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
 *               dosage: { type: string }
 *               frequency: { type: string }
 *               duration: { type: string }
 *               instructions: { type: string }
 *               refills: { type: integer, minimum: 0 }
 *               status: { type: string }
 *     responses:
 *       200: { description: Prescription updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Prescription not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Prescriptions]
 *     summary: Delete a prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Prescription deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Prescription not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createPrescriptionSchema), prescriptionController.create);
router.get('/', prescriptionController.getAll);
router.get('/:id', validateParams(idParamSchema), prescriptionController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePrescriptionSchema),
  prescriptionController.update
);
router.delete('/:id', validateParams(idParamSchema), prescriptionController.delete);

export default router;
