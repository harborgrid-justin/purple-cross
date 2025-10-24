/**
 * WF-COMP-XXX | handlers.ts - MSW API Handlers
 * Purpose: Mock Service Worker request handlers for testing
 * Dependencies: msw
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/constants';

const BASE_URL = API_CONFIG.BASE_URL;

/**
 * Mock data for common API responses
 */
export const mockData = {
  patients: [
    {
      id: '1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      dateOfBirth: '2020-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Siamese',
      dateOfBirth: '2019-05-20',
      status: 'active',
    },
  ],
  clients: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-0100',
      status: 'active',
    },
  ],
  appointments: [
    {
      id: '1',
      patientId: '1',
      clientId: '1',
      appointmentType: 'checkup',
      startTime: '2025-10-25T10:00:00Z',
      endTime: '2025-10-25T10:30:00Z',
      status: 'scheduled',
    },
  ],
  medicalRecords: [
    {
      id: '1',
      patientId: '1',
      visitDate: '2025-10-20',
      chiefComplaint: 'Annual checkup',
      diagnosis: 'Healthy',
      treatment: 'Vaccinations',
      status: 'completed',
    },
  ],
};

/**
 * MSW request handlers for common API endpoints
 */
export const handlers = [
  // Patient endpoints
  http.get(`${BASE_URL}/patients`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    if (search) {
      const filtered = mockData.patients.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      return HttpResponse.json({
        status: 'success',
        data: { patients: filtered, total: filtered.length },
      });
    }

    return HttpResponse.json({
      status: 'success',
      data: { patients: mockData.patients, total: mockData.patients.length },
    });
  }),

  http.get(`${BASE_URL}/patients/:id`, ({ params }) => {
    const { id } = params;
    const patient = mockData.patients.find((p) => p.id === id);

    if (!patient) {
      return HttpResponse.json(
        { status: 'error', message: 'Patient not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ status: 'success', data: patient });
  }),

  http.post(`${BASE_URL}/patients`, async ({ request }) => {
    const body = (await request.json()) as any;
    const newPatient = {
      id: String(mockData.patients.length + 1),
      ...body,
      status: 'active',
    };

    return HttpResponse.json(
      { status: 'success', data: newPatient },
      { status: 201 }
    );
  }),

  http.patch(`${BASE_URL}/patients/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as any;
    const patient = mockData.patients.find((p) => p.id === id);

    if (!patient) {
      return HttpResponse.json(
        { status: 'error', message: 'Patient not found' },
        { status: 404 }
      );
    }

    const updated = { ...patient, ...body };
    return HttpResponse.json({ status: 'success', data: updated });
  }),

  http.delete(`${BASE_URL}/patients/:id`, ({ params }) => {
    const { id } = params;
    const patient = mockData.patients.find((p) => p.id === id);

    if (!patient) {
      return HttpResponse.json(
        { status: 'error', message: 'Patient not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      { status: 'success', message: 'Patient deleted' },
      { status: 200 }
    );
  }),

  // Client endpoints
  http.get(`${BASE_URL}/clients`, () => {
    return HttpResponse.json({
      status: 'success',
      data: { clients: mockData.clients, total: mockData.clients.length },
    });
  }),

  http.get(`${BASE_URL}/clients/:id`, ({ params }) => {
    const { id } = params;
    const client = mockData.clients.find((c) => c.id === id);

    if (!client) {
      return HttpResponse.json(
        { status: 'error', message: 'Client not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ status: 'success', data: client });
  }),

  // Appointment endpoints
  http.get(`${BASE_URL}/appointments`, () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        appointments: mockData.appointments,
        total: mockData.appointments.length,
      },
    });
  }),

  http.get(`${BASE_URL}/appointments/:id`, ({ params }) => {
    const { id } = params;
    const appointment = mockData.appointments.find((a) => a.id === id);

    if (!appointment) {
      return HttpResponse.json(
        { status: 'error', message: 'Appointment not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ status: 'success', data: appointment });
  }),

  // Medical Record endpoints
  http.get(`${BASE_URL}/medical-records`, () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        medicalRecords: mockData.medicalRecords,
        total: mockData.medicalRecords.length,
      },
    });
  }),

  // Auth endpoints
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;

    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        status: 'success',
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'veterinarian',
          },
        },
      });
    }

    return HttpResponse.json(
      { status: 'error', message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Error simulation handlers
  http.get(`${BASE_URL}/error/500`, () => {
    return HttpResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }),

  http.get(`${BASE_URL}/error/timeout`, () => {
    return new Promise(() => {
      // Never resolves to simulate timeout
    });
  }),
];

/**
 * Error handlers for specific test scenarios
 */
export const errorHandlers = {
  networkError: http.get(`${BASE_URL}/*`, () => {
    return HttpResponse.error();
  }),

  serverError: http.get(`${BASE_URL}/*`, () => {
    return HttpResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }),

  unauthorized: http.get(`${BASE_URL}/*`, () => {
    return HttpResponse.json(
      { status: 'error', message: 'Unauthorized' },
      { status: 401 }
    );
  }),
};
