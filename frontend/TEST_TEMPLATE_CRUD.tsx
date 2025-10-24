/**
 * CRUD PAGE TEST TEMPLATE
 *
 * This template provides a complete testing structure for CRUD pages.
 * Copy this file and adapt it for your specific page.
 *
 * USAGE:
 * 1. Copy this file to: src/pages/[module]/__tests__/[PageName].test.tsx
 * 2. Replace MODULE_NAME with your module (e.g., 'patients', 'clients')
 * 3. Replace ENTITY_NAME with singular entity (e.g., 'patient', 'client')
 * 4. Update form fields to match your page
 * 5. Add/remove tests based on page functionality
 *
 * EXAMPLE:
 * For PatientsCreate.tsx:
 * - File: src/pages/patients/__tests__/PatientsCreate.test.tsx
 * - MODULE_NAME: 'patients'
 * - ENTITY_NAME: 'patient'
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, createUser, waitFor } from '@/test-utils';
import { server } from '@/test-utils/mocks/server';
import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/constants';

// TODO: Import your page component
// import EntityCreate from '@/pages/MODULE_NAME/EntityCreate';

// TODO: Import mock data
// import { mockEntity } from '@/test-utils/fixtures';

const MODULE_NAME = 'patients'; // TODO: Change to your module
const ENTITY_NAME = 'patient';  // TODO: Change to your entity
const API_ENDPOINT = `${API_CONFIG.BASE_URL}/${MODULE_NAME}`;

// =============================================================================
// CREATE PAGE TESTS
// =============================================================================

describe('EntityCreate Page', () => {

  // ---------------------------------------------------------------------------
  // 1. FORM RENDERING TESTS
  // ---------------------------------------------------------------------------

  describe('Form Rendering', () => {
    it('should render all required form fields', () => {
      // TODO: Update with your actual form fields
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      // Required fields
      expect(getByLabelText(/field1/i)).toBeInTheDocument();
      expect(getByLabelText(/field2/i)).toBeInTheDocument();

      // Optional fields
      expect(getByLabelText(/optional field/i)).toBeInTheDocument();
    });

    it('should show required field indicators (*)', () => {
      const { getAllByText } = render(<div>TODO: EntityCreate</div>);

      // Check for * indicators on required fields
      const requiredIndicators = getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });

    it('should render submit button', () => {
      const { getByRole } = render(<div>TODO: EntityCreate</div>);

      const submitButton = getByRole('button', { name: /create/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('should render cancel button/link', () => {
      const { getByRole } = render(<div>TODO: EntityCreate</div>);

      const cancelLink = getByRole('link', { name: /cancel/i });
      expect(cancelLink).toBeInTheDocument();
      expect(cancelLink).toHaveAttribute('href', `/${MODULE_NAME}`);
    });

    it('should display page title', () => {
      const { getByRole } = render(<div>TODO: EntityCreate</div>);

      const heading = getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(new RegExp(`create.*${ENTITY_NAME}`, 'i'));
    });
  });

  // ---------------------------------------------------------------------------
  // 2. FORM VALIDATION TESTS
  // ---------------------------------------------------------------------------

  describe('Form Validation', () => {
    it('should prevent submission with empty required fields', async () => {
      const user = createUser();
      const { getByRole } = render(<div>TODO: EntityCreate</div>);

      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Form should not submit (browser native validation)
      // Button should still be in document (no navigation)
      expect(submitButton).toBeInTheDocument();
    });

    it('should validate field format (e.g., email, date)', async () => {
      // TODO: Add validation tests specific to your form
      // Example: email format, date format, number range, etc.
    });

    it('should show validation error messages', async () => {
      // TODO: If your form shows client-side validation errors
    });
  });

  // ---------------------------------------------------------------------------
  // 3. USER INTERACTIONS
  // ---------------------------------------------------------------------------

  describe('User Interactions', () => {
    it('should update form state when user types in text input', async () => {
      const user = createUser();
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      const nameInput = getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameInput, 'Test Name');

      expect(nameInput.value).toBe('Test Name');
    });

    it('should update form state when user selects from dropdown', async () => {
      const user = createUser();
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      // TODO: Update with your actual select field
      const selectField = getByLabelText(/category/i) as HTMLSelectElement;
      await user.selectOptions(selectField, 'option1');

      expect(selectField.value).toBe('option1');
    });

    it('should update form state when user picks a date', async () => {
      const user = createUser();
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      // TODO: Update with your actual date field
      const dateInput = getByLabelText(/date/i) as HTMLInputElement;
      await user.type(dateInput, '2025-10-24');

      expect(dateInput.value).toBe('2025-10-24');
    });
  });

  // ---------------------------------------------------------------------------
  // 4. FORM SUBMISSION - SUCCESS
  // ---------------------------------------------------------------------------

  describe('Form Submission - Success', () => {
    beforeEach(() => {
      // Reset handlers before each test
      server.resetHandlers();
    });

    it('should submit form and navigate to detail page on success', async () => {
      const user = createUser();
      const mockNavigate = vi.fn();

      // Mock successful API response
      server.use(
        http.post(API_ENDPOINT, async ({ request }) => {
          const body = await request.json();

          return HttpResponse.json({
            status: 'success',
            data: {
              id: 'new-entity-123',
              ...body
            }
          }, { status: 201 });
        })
      );

      const { getByLabelText, getByRole } = render(<div>TODO: EntityCreate</div>);

      // TODO: Fill out your form fields
      await user.type(getByLabelText(/field1/i), 'Test Value');
      await user.selectOptions(getByLabelText(/field2/i), 'option1');

      // Submit form
      await user.click(getByRole('button', { name: /create/i }));

      // TODO: Assert navigation (you may need to mock useNavigate)
      // await waitFor(() => {
      //   expect(mockNavigate).toHaveBeenCalledWith(`/${MODULE_NAME}/new-entity-123`);
      // });
    });

    it('should show loading state during submission', async () => {
      const user = createUser();

      // Add delay to API response to test loading state
      server.use(
        http.post(API_ENDPOINT, async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({
            status: 'success',
            data: { id: '123' }
          }, { status: 201 });
        })
      );

      const { getByLabelText, getByRole } = render(<div>TODO: EntityCreate</div>);

      // Fill minimum required fields
      await user.type(getByLabelText(/field1/i), 'Test');

      // Submit form
      await user.click(getByRole('button', { name: /create/i }));

      // Check loading state
      await waitFor(() => {
        const button = getByRole('button', { name: /creating|loading/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({ status: 'success', data: { id: '123' } });
        })
      );

      const { getByLabelText, getByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');

      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should send correct data to API', async () => {
      const user = createUser();
      let requestBody: any = null;

      server.use(
        http.post(API_ENDPOINT, async ({ request }) => {
          requestBody = await request.json();
          return HttpResponse.json({
            status: 'success',
            data: { id: '123', ...requestBody }
          });
        })
      );

      const { getByLabelText, getByRole } = render(<div>TODO: EntityCreate</div>);

      // TODO: Fill form with specific values
      await user.type(getByLabelText(/field1/i), 'Test Value');
      await user.click(getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(requestBody).toMatchObject({
          field1: 'Test Value'
          // TODO: Add more field assertions
        });
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. FORM SUBMISSION - ERROR HANDLING
  // ---------------------------------------------------------------------------

  describe('Form Submission - Error Handling', () => {
    it('should display error message on 400 Bad Request', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, () => {
          return HttpResponse.json({
            status: 'error',
            message: 'Validation failed: Field1 is required'
          }, { status: 400 });
        })
      );

      const { getByLabelText, getByRole, findByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Invalid');
      await user.click(getByRole('button', { name: /create/i }));

      // Check error alert
      const alert = await findByRole('alert');
      expect(alert).toHaveTextContent(/validation failed/i);
    });

    it('should display error message on 500 Server Error', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, () => {
          return HttpResponse.json({
            status: 'error',
            message: 'Internal server error'
          }, { status: 500 });
        })
      );

      const { getByLabelText, getByRole, findByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');
      await user.click(getByRole('button', { name: /create/i }));

      const alert = await findByRole('alert');
      expect(alert).toHaveTextContent(/server error|failed/i);
    });

    it('should handle network error', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, () => {
          return HttpResponse.error();
        })
      );

      const { getByLabelText, getByRole, findByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');
      await user.click(getByRole('button', { name: /create/i }));

      const alert = await findByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should re-enable submit button after error', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, () => {
          return HttpResponse.json({ status: 'error', message: 'Error' }, { status: 400 });
        })
      );

      const { getByLabelText, getByRole, findByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');

      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Wait for error
      await findByRole('alert');

      // Button should be enabled again
      expect(submitButton).not.toBeDisabled();
    });

    it('should allow user to retry after error', async () => {
      const user = createUser();
      let attemptCount = 0;

      server.use(
        http.post(API_ENDPOINT, () => {
          attemptCount++;
          if (attemptCount === 1) {
            return HttpResponse.json({ status: 'error' }, { status: 500 });
          }
          return HttpResponse.json({ status: 'success', data: { id: '123' } });
        })
      );

      const { getByLabelText, getByRole, findByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');
      await user.click(getByRole('button', { name: /create/i }));

      // Wait for first error
      await findByRole('alert');

      // Retry
      await user.click(getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(attemptCount).toBe(2);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 6. NAVIGATION TESTS
  // ---------------------------------------------------------------------------

  describe('Navigation', () => {
    it('should navigate back to list when cancel is clicked', () => {
      const { getByRole } = render(<div>TODO: EntityCreate</div>);

      const cancelLink = getByRole('link', { name: /cancel/i });
      expect(cancelLink).toHaveAttribute('href', `/${MODULE_NAME}`);
    });

    it('should navigate to detail page after successful creation', async () => {
      // TODO: Mock useNavigate and assert navigation
    });
  });

  // ---------------------------------------------------------------------------
  // 7. ACCESSIBILITY TESTS
  // ---------------------------------------------------------------------------

  describe('Accessibility', () => {
    it('should have aria-required on required fields', () => {
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      // TODO: Update with your required fields
      expect(getByLabelText(/field1/i)).toHaveAttribute('aria-required', 'true');
    });

    it('should announce errors via role="alert"', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, () => HttpResponse.error())
      );

      const { getByLabelText, getByRole, findByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');
      await user.click(getByRole('button', { name: /create/i }));

      const alert = await findByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const { getByRole } = render(<div>TODO: EntityCreate</div>);

      const h1 = getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have labels for all form inputs', () => {
      const { container } = render(<div>TODO: EntityCreate</div>);

      // All inputs should have associated labels
      const inputs = container.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const id = input.id;
        const label = container.querySelector(`label[for="${id}"]`);
        expect(label).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = createUser();
      const { getByLabelText, getByRole } = render(<div>TODO: EntityCreate</div>);

      // Tab to first field
      await user.tab();
      expect(getByLabelText(/field1/i)).toHaveFocus();

      // Tab to submit button
      await user.tab();
      // Continue tabbing through form...
    });

    it('should submit form via Enter key in text input', async () => {
      const user = createUser();

      server.use(
        http.post(API_ENDPOINT, () => {
          return HttpResponse.json({ status: 'success', data: { id: '123' } });
        })
      );

      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      const input = getByLabelText(/field1/i);
      await user.type(input, 'Test{Enter}');

      // TODO: Assert form was submitted
    });
  });

  // ---------------------------------------------------------------------------
  // 8. EDGE CASES
  // ---------------------------------------------------------------------------

  describe('Edge Cases', () => {
    it('should handle very long input values', async () => {
      const user = createUser();
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      const longText = 'A'.repeat(1000);
      const input = getByLabelText(/field1/i) as HTMLInputElement;
      await user.type(input, longText);

      expect(input.value).toBe(longText);
    });

    it('should handle special characters in input', async () => {
      const user = createUser();
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      const specialText = '<script>alert("xss")</script>';
      const input = getByLabelText(/field1/i) as HTMLInputElement;
      await user.type(input, specialText);

      expect(input.value).toBe(specialText);
    });

    it('should prevent double submission', async () => {
      const user = createUser();
      let requestCount = 0;

      server.use(
        http.post(API_ENDPOINT, async () => {
          requestCount++;
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({ status: 'success', data: { id: '123' } });
        })
      );

      const { getByLabelText, getByRole } = render(<div>TODO: EntityCreate</div>);

      await user.type(getByLabelText(/field1/i), 'Test');

      const submitButton = getByRole('button', { name: /create/i });

      // Click twice rapidly
      await user.click(submitButton);
      await user.click(submitButton);

      await waitFor(() => {
        expect(requestCount).toBe(1); // Should only submit once
      });
    });

    it('should handle rapid field changes', async () => {
      const user = createUser();
      const { getByLabelText } = render(<div>TODO: EntityCreate</div>);

      const input = getByLabelText(/field1/i) as HTMLInputElement;

      await user.type(input, 'ABC');
      await user.clear(input);
      await user.type(input, 'XYZ');

      expect(input.value).toBe('XYZ');
    });
  });

  // ---------------------------------------------------------------------------
  // 9. SNAPSHOT TESTS (Optional)
  // ---------------------------------------------------------------------------

  describe('Snapshot Tests', () => {
    it('should match snapshot for default state', () => {
      const { container } = render(<div>TODO: EntityCreate</div>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for loading state', async () => {
      // TODO: Trigger loading state and snapshot
    });

    it('should match snapshot for error state', async () => {
      // TODO: Trigger error state and snapshot
    });
  });
});

// =============================================================================
// ADDITIONAL TEMPLATES FOR OTHER CRUD PAGES
// =============================================================================

/*

// MAIN/LIST PAGE TESTS
describe('EntityMain Page', () => {
  describe('Data Fetching', () => {
    it('should fetch and display entity list', async () => {});
    it('should show loading state', () => {});
    it('should show empty state when no data', async () => {});
    it('should handle fetch error', async () => {});
  });

  describe('Search Functionality', () => {
    it('should filter results by search term', async () => {});
    it('should debounce search input', async () => {});
    it('should clear results when search is cleared', async () => {});
  });

  describe('List Rendering', () => {
    it('should display all entities in table', async () => {});
    it('should format data correctly (dates, currency, etc.)', async () => {});
    it('should show View button for each row', async () => {});
    it('should show Edit button for each row', async () => {});
  });

  describe('User Interactions', () => {
    it('should navigate to detail page on View click', async () => {});
    it('should navigate to edit page on Edit click', async () => {});
    it('should navigate to create page on Add button click', async () => {});
  });

  describe('Pagination', () => {
    it('should paginate results', async () => {});
    it('should navigate to next page', async () => {});
    it('should navigate to previous page', async () => {});
  });
});

// DETAIL PAGE TESTS
describe('EntityDetail Page', () => {
  describe('Data Fetching', () => {
    it('should fetch entity by ID', async () => {});
    it('should show loading state', () => {});
    it('should handle 404 not found', async () => {});
    it('should handle fetch error', async () => {});
  });

  describe('Detail Rendering', () => {
    it('should display all entity fields', async () => {});
    it('should format data correctly', async () => {});
    it('should show Edit button', async () => {});
    it('should show Back button', async () => {});
  });

  describe('Navigation', () => {
    it('should navigate to edit page', async () => {});
    it('should navigate back to list', async () => {});
  });
});

// EDIT PAGE TESTS
describe('EntityEdit Page', () => {
  describe('Data Pre-population', () => {
    it('should fetch and populate existing data', async () => {});
    it('should show loading while fetching', () => {});
    it('should handle fetch error', async () => {});
  });

  describe('Form Submission', () => {
    it('should update entity successfully', async () => {});
    it('should show loading during update', async () => {});
    it('should handle update error', async () => {});
    it('should navigate after successful update', async () => {});
  });

  describe('Dirty Checking', () => {
    it('should detect when form is modified', async () => {});
    it('should warn on navigation with unsaved changes', async () => {});
  });
});

*/
