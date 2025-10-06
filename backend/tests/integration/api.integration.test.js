"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
describe('API Integration Tests', () => {
    let app;
    beforeAll(() => {
        // Create minimal Express app for testing
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Mock API endpoints
        app.get('/api/patients', (_req, res) => {
            res.status(200).json({
                data: [
                    { id: '1', name: 'Max', species: 'Dog' },
                    { id: '2', name: 'Luna', species: 'Cat' },
                ],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 2,
                    totalPages: 1,
                },
            });
        });
        app.post('/api/patients', (req, res) => {
            const { name, species } = req.body;
            if (!name || !species) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            res.status(201).json({
                id: '3',
                name,
                species,
            });
        });
        app.get('/api/patients/:id', (req, res) => {
            const { id } = req.params;
            if (id === '999') {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.status(200).json({
                id,
                name: 'Test Patient',
                species: 'Dog',
            });
        });
    });
    describe('GET /api/patients', () => {
        it('should return list of patients', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/patients');
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination).toBeDefined();
        });
        it('should include pagination metadata', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/patients');
            expect(response.body.pagination).toHaveProperty('page');
            expect(response.body.pagination).toHaveProperty('limit');
            expect(response.body.pagination).toHaveProperty('total');
            expect(response.body.pagination).toHaveProperty('totalPages');
        });
    });
    describe('POST /api/patients', () => {
        it('should create a new patient', async () => {
            const newPatient = {
                name: 'Buddy',
                species: 'Dog',
            };
            const response = await (0, supertest_1.default)(app).post('/api/patients').send(newPatient);
            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Buddy');
            expect(response.body.species).toBe('Dog');
            expect(response.body.id).toBeDefined();
        });
        it('should return 400 for invalid data', async () => {
            const response = await (0, supertest_1.default)(app).post('/api/patients').send({ name: 'Buddy' }); // Missing species
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });
    });
    describe('GET /api/patients/:id', () => {
        it('should return a specific patient', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/patients/1');
            expect(response.status).toBe(200);
            expect(response.body.id).toBe('1');
        });
        it('should return 404 for non-existent patient', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/patients/999');
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Patient not found');
        });
    });
});
//# sourceMappingURL=api.integration.test.js.map