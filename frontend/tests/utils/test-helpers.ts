/**
 * Playwright Test Helpers
 * Purpose: Reusable utilities for E2E testing
 */

import { Page, expect } from '@playwright/test';

/**
 * Login helper function
 */
export async function login(page: Page, email: string = 'test@example.com', password: string = 'password123'): Promise<void> {
  await page.goto('/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard|patients|appointments)/);
}

/**
 * Logout helper function
 */
export async function logout(page: Page): Promise<void> {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/login');
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingToComplete(page: Page): Promise<void> {
  await page.waitForSelector('[data-testid="loading"]', { state: 'hidden', timeout: 10000 });
}

/**
 * Fill form and submit
 */
export async function fillFormAndSubmit(
  page: Page,
  formData: Record<string, string>,
  submitSelector: string = 'button[type="submit"]'
): Promise<void> {
  for (const [name, value] of Object.entries(formData)) {
    const input = page.locator(`[name="${name}"]`);
    const inputType = await input.getAttribute('type');

    if (inputType === 'checkbox') {
      if (value === 'true') {
        await input.check();
      }
    } else if (await input.evaluate((el) => el.tagName.toLowerCase() === 'select')) {
      await input.selectOption(value);
    } else {
      await input.fill(value);
    }
  }

  await page.click(submitSelector);
}

/**
 * Check for success notification
 */
export async function expectSuccessNotification(page: Page, message?: string): Promise<void> {
  const notification = page.locator('[role="alert"], .notification, .toast');
  await expect(notification).toBeVisible({ timeout: 5000 });

  if (message) {
    await expect(notification).toContainText(message);
  }
}

/**
 * Check for error notification
 */
export async function expectErrorNotification(page: Page, message?: string): Promise<void> {
  const notification = page.locator('[role="alert"].error, .notification.error, .toast.error');
  await expect(notification).toBeVisible({ timeout: 5000 });

  if (message) {
    await expect(notification).toContainText(message);
  }
}

/**
 * Navigate to a specific page
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitForLoadingToComplete(page);
}

/**
 * Search in a table/list
 */
export async function searchFor(page: Page, searchTerm: string, searchInputSelector: string = '[type="search"]'): Promise<void> {
  await page.fill(searchInputSelector, searchTerm);
  await page.waitForTimeout(500); // Debounce
  await waitForLoadingToComplete(page);
}

/**
 * Click on a table row
 */
export async function clickTableRow(page: Page, rowIndex: number): Promise<void> {
  await page.click(`table tbody tr:nth-child(${rowIndex})`);
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page): Promise<number> {
  return await page.locator('table tbody tr').count();
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForResponse((response) => {
    const url = response.url();
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  responseData: unknown,
  statusCode: number = 200
): Promise<void> {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

/**
 * Take screenshot with custom name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Check accessibility violations (requires axe-playwright)
 */
export async function checkAccessibility(page: Page): Promise<void> {
  // Placeholder for axe-core integration
  // Install: npm install -D @axe-core/playwright
  // const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  // expect(accessibilityScanResults.violations).toEqual([]);
}

/**
 * Upload file
 */
export async function uploadFile(page: Page, inputSelector: string, filePath: string): Promise<void> {
  const fileInput = page.locator(inputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Clear local storage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Set local storage item
 */
export async function setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, value);
    },
    { key, value }
  );
}

/**
 * Get local storage item
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, key);
}
