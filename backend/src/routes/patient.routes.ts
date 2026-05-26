import { Router } from 'express';
import patientController from '../controllers/patient.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createPatientSchema = Joi.object({
  name: Joi.string().required(),
  species: Joi.string().required(),
  breed: Joi.string().optional(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().required(),
  color: Joi.string().optional(),
  weight: Joi.number().optional(),
  microchipId: Joi.string().optional(),
  insuranceProvider: Joi.string().optional(),
  insurancePolicy: Joi.string().optional(),
  ownerId: Joi.string().uuid().required(),
});

const updatePatientSchema = Joi.object({
  name: Joi.string().optional(),
  species: Joi.string().optional(),
  breed: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().optional(),
  color: Joi.string().optional(),
  weight: Joi.number().optional(),
  microchipId: Joi.string().optional(),
  insuranceProvider: Joi.string().optional(),
  insurancePolicy: Joi.string().optional(),
  status: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * @openapi
 * /patients:
 *   get:
 *     tags: [Patients]
 *     summary: List patients
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: ownerId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Paginated list of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Patient' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Patients]
 *     summary: Create a patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, species, dateOfBirth, gender, ownerId]
 *             properties:
 *               name: { type: string }
 *               species: { type: string }
 *               breed: { type: string }
 *               dateOfBirth: { type: string, format: date-time }
 *               gender: { type: string }
 *               color: { type: string }
 *               weight: { type: number }
 *               microchipId: { type: string }
 *               insuranceProvider: { type: string }
 *               insurancePolicy: { type: string }
 *               ownerId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Patient created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Patient' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Get a patient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Patient found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Patient' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Patients]
 *     summary: Update a patient
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
 *               name: { type: string }
 *               species: { type: string }
 *               breed: { type: string }
 *               dateOfBirth: { type: string, format: date-time }
 *               gender: { type: string }
 *               color: { type: string }
 *               weight: { type: number }
 *               microchipId: { type: string }
 *               insuranceProvider: { type: string }
 *               insurancePolicy: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Patient updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Patient' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Patients]
 *     summary: Delete a patient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Patient deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createPatientSchema), patientController.create);
router.get('/', patientController.getAll);
router.get('/:id', validateParams(idParamSchema), patientController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updatePatientSchema),
  patientController.update
);
router.delete('/:id', validateParams(idParamSchema), patientController.delete);

export default router;
