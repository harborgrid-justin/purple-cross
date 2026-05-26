import { Router } from 'express';
import breedInfoController from '../controllers/breed-info.controller';
import { validate, validateParams } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const createBreedInfoSchema = Joi.object({
  breed: Joi.string().required(),
  species: Joi.string().required(),
  commonHealthIssues: Joi.any().optional(),
  geneticPredispositions: Joi.any().optional(),
  careGuidelines: Joi.any().optional(),
  nutritionalNeeds: Joi.any().optional(),
  averageLifespan: Joi.number().optional(),
  temperament: Joi.string().optional(),
});

const updateBreedInfoSchema = Joi.object({
  breed: Joi.string().optional(),
  species: Joi.string().optional(),
  commonHealthIssues: Joi.any().optional(),
  geneticPredispositions: Joi.any().optional(),
  careGuidelines: Joi.any().optional(),
  nutritionalNeeds: Joi.any().optional(),
  averageLifespan: Joi.number().optional(),
  temperament: Joi.string().optional(),
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const breedParamSchema = Joi.object({
  breed: Joi.string().required(),
});

/**
 * @openapi
 * /breed-info:
 *   get:
 *     tags: [Breed Info]
 *     summary: List breed information records
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: species
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of breed info records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: { type: object } }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Breed Info]
 *     summary: Create a breed info record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [breed, species]
 *             properties:
 *               breed: { type: string }
 *               species: { type: string }
 *               commonHealthIssues: {}
 *               geneticPredispositions: {}
 *               careGuidelines: {}
 *               nutritionalNeeds: {}
 *               averageLifespan: { type: number }
 *               temperament: { type: string }
 *     responses:
 *       201: { description: Breed info created }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *
 * /breed-info/breed/{breed}:
 *   get:
 *     tags: [Breed Info]
 *     summary: Get breed info by breed name
 *     parameters:
 *       - in: path
 *         name: breed
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Breed info found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Breed info not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *
 * /breed-info/{id}:
 *   get:
 *     tags: [Breed Info]
 *     summary: Get a breed info record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Breed info found }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Breed info not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   put:
 *     tags: [Breed Info]
 *     summary: Update a breed info record
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
 *               breed: { type: string }
 *               species: { type: string }
 *               commonHealthIssues: {}
 *               geneticPredispositions: {}
 *               careGuidelines: {}
 *               nutritionalNeeds: {}
 *               averageLifespan: { type: number }
 *               temperament: { type: string }
 *     responses:
 *       200: { description: Breed info updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Breed info not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   delete:
 *     tags: [Breed Info]
 *     summary: Delete a breed info record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Breed info deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404:
 *         description: Breed info not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', validate(createBreedInfoSchema), breedInfoController.create);
router.get('/', breedInfoController.getAll);
router.get('/breed/:breed', validateParams(breedParamSchema), breedInfoController.getByBreed);
router.get('/:id', validateParams(idParamSchema), breedInfoController.getById);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateBreedInfoSchema),
  breedInfoController.update
);
router.delete('/:id', validateParams(idParamSchema), breedInfoController.delete);

export default router;
