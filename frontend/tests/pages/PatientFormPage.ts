/**
 * Patient Form Page Object Model
 * Purpose: Encapsulate patient form interactions for E2E tests
 */

import { Page, Locator, expect } from '@playwright/test';

export interface PatientFormData {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  gender?: string;
  weight?: string;
  color?: string;
}

export class PatientFormPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly speciesSelect: Locator;
  readonly breedInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly genderSelect: Locator;
  readonly weightInput: Locator;
  readonly colorInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('[name="name"]');
    this.speciesSelect = page.locator('[name="species"]');
    this.breedInput = page.locator('[name="breed"]');
    this.dateOfBirthInput = page.locator('[name="dateOfBirth"]');
    this.genderSelect = page.locator('[name="gender"]');
    this.weightInput = page.locator('[name="weight"]');
    this.colorInput = page.locator('[name="color"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.validationError = page.locator('.error, [role="alert"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/patients/new');
  }

  async gotoEdit(patientId: string): Promise<void> {
    await this.page.goto(`/patients/${patientId}/edit`);
  }

  async fillForm(data: PatientFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.speciesSelect.selectOption(data.species);

    if (data.breed) {
      await this.breedInput.fill(data.breed);
    }

    if (data.dateOfBirth) {
      await this.dateOfBirthInput.fill(data.dateOfBirth);
    }

    if (data.gender) {
      await this.genderSelect.selectOption(data.gender);
    }

    if (data.weight) {
      await this.weightInput.fill(data.weight);
    }

    if (data.color) {
      await this.colorInput.fill(data.color);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.validationError).toContainText(message);
  }

  async expectSuccessfulSubmission(): Promise<void> {
    // Wait for redirect to patient detail page
    await expect(this.page).toHaveURL(/\/patients\/[a-zA-Z0-9-]+$/);
  }
}
