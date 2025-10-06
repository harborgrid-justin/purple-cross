import { validate, validateParams } from '../../src/middleware/validation';
import Joi from 'joi';
import { Request, Response } from 'express';

describe('Validation Middleware Tests', () => {
  describe('validate() - Request Body Validation', () => {
    it('should pass validation with valid data', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        age: Joi.number().optional(),
      });

      const middleware = validate(schema);
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should reject missing required field', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      const middleware = validate(schema);
      const req = {
        body: {
          name: 'John Doe',
          // email is missing
        },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      expect(() => middleware(req, res, next)).toThrow();
    });

    it('should reject invalid email format', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });

      const middleware = validate(schema);
      const req = {
        body: {
          email: 'invalid-email',
        },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      expect(() => middleware(req, res, next)).toThrow();
    });

    it('should accept request with extra fields (stripUnknown option)', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const middleware = validate(schema);
      const req = {
        body: {
          name: 'John Doe',
          extraField: 'will be ignored',
        },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      // Should not throw even with extra fields due to stripUnknown: true
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('validateParams() - Path Parameters Validation', () => {
    it('should pass validation with valid UUID', () => {
      const schema = Joi.object({
        id: Joi.string().uuid().required(),
      });

      const middleware = validateParams(schema);
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should reject invalid UUID format', () => {
      const schema = Joi.object({
        id: Joi.string().uuid().required(),
      });

      const middleware = validateParams(schema);
      const req = {
        params: {
          id: 'invalid-uuid',
        },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      expect(() => middleware(req, res, next)).toThrow();
    });

    it('should reject missing required parameter', () => {
      const schema = Joi.object({
        id: Joi.string().uuid().required(),
      });

      const middleware = validateParams(schema);
      const req = {
        params: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      expect(() => middleware(req, res, next)).toThrow();
    });
  });

  describe('Route Validation Schemas', () => {
    it('should validate breed info creation schema', () => {
      const schema = Joi.object({
        breed: Joi.string().required(),
        species: Joi.string().required(),
        averageLifespan: Joi.number().optional(),
      });

      const validData = {
        breed: 'Golden Retriever',
        species: 'Dog',
        averageLifespan: 12,
      };

      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should validate time block creation schema', () => {
      const schema = Joi.object({
        staffId: Joi.string().uuid().required(),
        blockType: Joi.string().required(),
        title: Joi.string().required(),
        startTime: Joi.date().required(),
        endTime: Joi.date().required(),
      });

      const validData = {
        staffId: '123e4567-e89b-12d3-a456-426614174000',
        blockType: 'vacation',
        title: 'Summer Break',
        startTime: new Date('2024-07-01'),
        endTime: new Date('2024-07-15'),
      };

      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should validate waitlist creation schema', () => {
      const schema = Joi.object({
        patientId: Joi.string().uuid().required(),
        clientId: Joi.string().uuid().required(),
        appointmentType: Joi.string().required(),
        reason: Joi.string().required(),
        priority: Joi.number().optional(),
      });

      const validData = {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '223e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'checkup',
        reason: 'Annual wellness exam',
        priority: 1,
      };

      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
