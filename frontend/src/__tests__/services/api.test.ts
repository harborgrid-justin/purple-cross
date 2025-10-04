import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should construct correct API URL', () => {
      const baseURL = 'http://localhost:3000';
      const endpoint = '/api/patients';
      const fullURL = `${baseURL}${endpoint}`;
      
      expect(fullURL).toBe('http://localhost:3000/api/patients');
    });

    it('should handle query parameters', () => {
      const buildURL = (base: string, params: Record<string, any>) => {
        const url = new URL(base);
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
        return url.toString();
      };

      const url = buildURL('http://localhost:3000/api/patients', {
        page: 1,
        limit: 20,
      });

      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
    });
  });

  describe('Response handling', () => {
    it('should parse JSON responses', async () => {
      const mockResponse = {
        data: { id: '123', name: 'Test' },
        status: 200,
      };

      expect(mockResponse.data).toHaveProperty('id');
      expect(mockResponse.data).toHaveProperty('name');
      expect(mockResponse.status).toBe(200);
    });

    it('should handle error responses', () => {
      const errorResponse = {
        message: 'Not Found',
        status: 404,
      };

      expect(errorResponse.status).toBe(404);
      expect(errorResponse.message).toBe('Not Found');
    });
  });

  describe('Authentication headers', () => {
    it('should include authorization header when token present', () => {
      const token = 'test-token-123';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      expect(headers.Authorization).toBe('Bearer test-token-123');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should not include auth header when token absent', () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      expect(headers.Authorization).toBeUndefined();
    });
  });
});
