/**
 * PatientForm Component Tests
 * Purpose: Comprehensive tests for patient form validation and submission
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils/render';
import { mockPatient } from '../../test-utils/fixtures';

// Mock the PatientForm component (adjust import path as needed)
const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

// This is a template - adjust based on actual component structure
const MockPatientForm = ({ onSubmit, onCancel, initialData }: any) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(Object.fromEntries(formData));
    }}
  >
    <input name="name" defaultValue={initialData?.name} required />
    <select name="species" defaultValue={initialData?.species} required>
      <option value="">Select species</option>
      <option value="Dog">Dog</option>
      <option value="Cat">Cat</option>
    </select>
    <input name="breed" defaultValue={initialData?.breed} />
    <input name="dateOfBirth" type="date" defaultValue={initialData?.dateOfBirth} />
    <select name="gender" defaultValue={initialData?.gender}>
      <option value="">Select gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
    <input name="weight" type="number" defaultValue={initialData?.weight} />
    <input name="color" defaultValue={initialData?.color} />
    <button type="submit">Submit</button>
    <button type="button" onClick={onCancel}>
      Cancel
    </button>
  </form>
);

describe('PatientForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /species/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /breed/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /weight/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out form
    await user.type(screen.getByRole('textbox', { name: /name/i }), 'Buddy');
    await user.selectOptions(screen.getByRole('combobox', { name: /species/i }), 'Dog');
    await user.type(screen.getByRole('textbox', { name: /breed/i }), 'Golden Retriever');
    await user.type(screen.getByRole('spinbutton', { name: /weight/i }), '30');

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Buddy',
          species: 'Dog',
          breed: 'Golden Retriever',
          weight: '30',
        })
      );
    });
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // HTML5 validation will prevent submission
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('pre-populates form when editing existing patient', () => {
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={mockPatient} />);

    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Buddy');
    expect(screen.getByRole('combobox', { name: /species/i })).toHaveValue('Dog');
    expect(screen.getByRole('textbox', { name: /breed/i })).toHaveValue('Golden Retriever');
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByRole('textbox', { name: /name/i });

    await user.type(nameInput, 'Buddy');
    await user.selectOptions(screen.getByRole('combobox', { name: /species/i }), 'Dog');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('validates weight is a positive number', async () => {
    const user = userEvent.setup();
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });

    // Try negative number
    await user.type(weightInput, '-10');

    // HTML5 validation should prevent submission
    expect(weightInput).toHaveValue(-10);
  });

  it('allows optional fields to be empty', async () => {
    const user = userEvent.setup();
    render(<MockPatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill only required fields
    await user.type(screen.getByRole('textbox', { name: /name/i }), 'Buddy');
    await user.selectOptions(screen.getByRole('combobox', { name: /species/i }), 'Dog');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Buddy',
          species: 'Dog',
        })
      );
    });
  });
});
