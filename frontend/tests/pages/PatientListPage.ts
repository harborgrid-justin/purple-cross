/**
 * Patient List Page Object Model
 * Purpose: Encapsulate patient list page interactions for E2E tests
 */

import { Page, Locator, expect } from '@playwright/test';

export class PatientListPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly addPatientButton: Locator;
  readonly patientTable: Locator;
  readonly filterButton: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrevious: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[type="search"], [placeholder*="Search"]');
    this.addPatientButton = page.locator('button:has-text("Add Patient"), a:has-text("New Patient")');
    this.patientTable = page.locator('table');
    this.filterButton = page.locator('button:has-text("Filter")');
    this.paginationNext = page.locator('[aria-label="Next page"], button:has-text("Next")');
    this.paginationPrevious = page.locator('[aria-label="Previous page"], button:has-text("Previous")');
  }

  async goto(): Promise<void> {
    await this.page.goto('/patients');
  }

  async search(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.page.waitForTimeout(500); // Debounce
  }

  async clickAddPatient(): Promise<void> {
    await this.addPatientButton.click();
  }

  async getPatientRowCount(): Promise<number> {
    return await this.page.locator('table tbody tr').count();
  }

  async clickPatientRow(index: number): Promise<void> {
    await this.page.locator(`table tbody tr:nth-child(${index})`).click();
  }

  async expectPatientInList(patientName: string): Promise<void> {
    const row = this.page.locator(`table tbody tr:has-text("${patientName}")`);
    await expect(row).toBeVisible();
  }

  async expectNoResultsMessage(): Promise<void> {
    const noResults = this.page.locator('text=/No patients found|No results/i');
    await expect(noResults).toBeVisible();
  }

  async goToNextPage(): Promise<void> {
    await this.paginationNext.click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.paginationPrevious.click();
  }
}
