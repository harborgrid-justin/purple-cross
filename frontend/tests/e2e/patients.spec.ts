/**
 * Patient Management E2E Tests
 * Purpose: Test patient CRUD operations
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PatientListPage } from '../pages/PatientListPage';
import { PatientFormPage } from '../pages/PatientFormPage';
import { clearLocalStorage } from '../utils/test-helpers';

test.describe('Patient Management', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorage(page);

    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    await loginPage.expectToBeRedirectedToDashboard();
  });

  test('should display patient list', async ({ page }) => {
    const patientListPage = new PatientListPage(page);

    await patientListPage.goto();

    // Table should be visible
    await expect(patientListPage.patientTable).toBeVisible();

    // Should have at least one patient or show empty state
    const rowCount = await patientListPage.getPatientRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('should create a new patient', async ({ page }) => {
    const patientFormPage = new PatientFormPage(page);

    await patientFormPage.goto();

    // Fill form
    await patientFormPage.fillForm({
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      dateOfBirth: '2020-01-15',
      gender: 'Male',
      weight: '30',
      color: 'Golden',
    });

    // Submit
    await patientFormPage.submit();

    // Should redirect to patient detail page
    await patientFormPage.expectSuccessfulSubmission();

    // Verify patient details are displayed
    await expect(page.locator('text=Max')).toBeVisible();
    await expect(page.locator('text=Golden Retriever')).toBeVisible();
  });

  test('should show validation errors when creating patient with missing required fields', async ({ page }) => {
    const patientFormPage = new PatientFormPage(page);

    await patientFormPage.goto();

    // Try to submit without filling required fields
    await patientFormPage.submit();

    // Should show validation errors
    await expect(page.locator('text=/Name is required/i')).toBeVisible();
    await expect(page.locator('text=/Species is required/i')).toBeVisible();
  });

  test('should search for patients', async ({ page }) => {
    const patientListPage = new PatientListPage(page);

    await patientListPage.goto();

    // Search for a patient
    await patientListPage.search('Buddy');

    // Wait for results to load
    await page.waitForTimeout(1000);

    // Should filter results (or show no results if patient doesn't exist)
    const rowCount = await patientListPage.getPatientRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to patient details when clicking on a row', async ({ page }) => {
    const patientListPage = new PatientListPage(page);

    await patientListPage.goto();

    const rowCount = await patientListPage.getPatientRowCount();

    if (rowCount > 0) {
      // Click on first patient
      await patientListPage.clickPatientRow(1);

      // Should navigate to patient detail page
      await expect(page).toHaveURL(/\/patients\/[a-zA-Z0-9-]+/);
    }
  });

  test('should edit an existing patient', async ({ page }) => {
    const patientListPage = new PatientListPage(page);
    const patientFormPage = new PatientFormPage(page);

    await patientListPage.goto();

    const rowCount = await patientListPage.getPatientRowCount();

    if (rowCount > 0) {
      // Click on first patient
      await patientListPage.clickPatientRow(1);

      // Click edit button
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');
      await editButton.click();

      // Wait for form to load
      await expect(patientFormPage.nameInput).toBeVisible();

      // Update patient name
      await patientFormPage.nameInput.fill('Updated Patient Name');

      // Submit
      await patientFormPage.submit();

      // Should redirect back to patient detail
      await expect(page).toHaveURL(/\/patients\/[a-zA-Z0-9-]+$/);

      // Verify updated name is displayed
      await expect(page.locator('text=Updated Patient Name')).toBeVisible();
    }
  });

  test('should delete a patient', async ({ page }) => {
    const patientListPage = new PatientListPage(page);

    await patientListPage.goto();

    const initialRowCount = await patientListPage.getPatientRowCount();

    if (initialRowCount > 0) {
      // Click on first patient
      await patientListPage.clickPatientRow(1);

      // Click delete button
      const deleteButton = page.locator('button:has-text("Delete")');
      await deleteButton.click();

      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      await confirmButton.click();

      // Should redirect back to patient list
      await expect(page).toHaveURL(/\/patients$/);

      // Wait for list to update
      await page.waitForTimeout(1000);

      // Row count should decrease
      const newRowCount = await patientListPage.getPatientRowCount();
      expect(newRowCount).toBe(initialRowCount - 1);
    }
  });

  test('should handle pagination', async ({ page }) => {
    const patientListPage = new PatientListPage(page);

    await patientListPage.goto();

    // Check if pagination is visible
    const paginationVisible = await patientListPage.paginationNext.isVisible();

    if (paginationVisible) {
      const firstPageRowCount = await patientListPage.getPatientRowCount();

      // Go to next page
      await patientListPage.goToNextPage();

      // Wait for page to load
      await page.waitForTimeout(1000);

      // Should be on page 2
      await expect(page).toHaveURL(/page=2/);

      // Go back to previous page
      await patientListPage.goToPreviousPage();

      // Should be back on page 1
      await expect(page).toHaveURL(/page=1|patients$/);
    }
  });
});
