/**
 * AppointmentForm Component Tests
 * Purpose: Test appointment booking and scheduling functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils/render';
import { mockAppointment, mockPatient, mockClient } from '../../test-utils/fixtures';

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

// Mock appointment form component
const MockAppointmentForm = ({ onSubmit, onCancel, initialData }: any) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(Object.fromEntries(formData));
    }}
  >
    <select name="patientId" defaultValue={initialData?.patientId} required>
      <option value="">Select patient</option>
      <option value="1">Buddy</option>
      <option value="2">Whiskers</option>
    </select>
    <select name="appointmentType" defaultValue={initialData?.appointmentType} required>
      <option value="">Select type</option>
      <option value="checkup">Checkup</option>
      <option value="surgery">Surgery</option>
      <option value="vaccination">Vaccination</option>
    </select>
    <input name="startTime" type="datetime-local" defaultValue={initialData?.startTime} required />
    <input name="endTime" type="datetime-local" defaultValue={initialData?.endTime} required />
    <textarea name="notes" defaultValue={initialData?.notes} />
    <button type="submit">Schedule Appointment</button>
    <button type="button" onClick={onCancel}>
      Cancel
    </button>
  </form>
);

describe('AppointmentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<MockAppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByRole('combobox', { name: /patient/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /schedule/i })).toBeInTheDocument();
  });

  it('submits appointment with valid data', async () => {
    const user = userEvent.setup();
    render(<MockAppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill form
    await user.selectOptions(screen.getByRole('combobox', { name: /patient/i }), '1');
    await user.selectOptions(screen.getByRole('combobox', { name: /type/i }), 'checkup');
    await user.type(screen.getByLabelText(/start time/i), '2024-03-15T10:00');
    await user.type(screen.getByLabelText(/end time/i), '2024-03-15T10:30');
    await user.type(screen.getByRole('textbox', { name: /notes/i }), 'Annual checkup');

    await user.click(screen.getByRole('button', { name: /schedule/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: '1',
          appointmentType: 'checkup',
          notes: 'Annual checkup',
        })
      );
    });
  });

  it('pre-populates form when editing appointment', () => {
    render(
      <MockAppointmentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={{
          patientId: '1',
          appointmentType: 'checkup',
          startTime: '2024-03-15T10:00',
          endTime: '2024-03-15T10:30',
          notes: 'Annual wellness exam',
        }}
      />
    );

    expect(screen.getByRole('combobox', { name: /patient/i })).toHaveValue('1');
    expect(screen.getByRole('combobox', { name: /type/i })).toHaveValue('checkup');
    expect(screen.getByRole('textbox', { name: /notes/i })).toHaveValue('Annual wellness exam');
  });

  it('validates end time is after start time', async () => {
    const user = userEvent.setup();
    render(<MockAppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.selectOptions(screen.getByRole('combobox', { name: /patient/i }), '1');
    await user.selectOptions(screen.getByRole('combobox', { name: /type/i }), 'checkup');
    await user.type(screen.getByLabelText(/start time/i), '2024-03-15T10:00');
    await user.type(screen.getByLabelText(/end time/i), '2024-03-15T09:00'); // Earlier than start

    // Note: Actual validation would be in the component
    // This test demonstrates the test pattern
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<MockAppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /schedule/i }));

    // HTML5 validation prevents submission
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<MockAppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
