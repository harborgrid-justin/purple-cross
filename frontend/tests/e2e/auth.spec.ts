/**
 * Authentication E2E Tests
 * Purpose: Test login, logout, and authentication flows
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { clearLocalStorage } from '../utils/test-helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorage(page);
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');

    // Should redirect to dashboard or patients page
    await loginPage.expectToBeRedirectedToDashboard();

    // Should have auth token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Should show error message
    await loginPage.expectError(/Invalid credentials|Login failed/i);

    // Should remain on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.submitButton.click();

    // Check for validation errors
    const emailError = page.locator('text=/Email is required/i');
    const passwordError = page.locator('text=/Password is required/i');

    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('should successfully log out', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Login first
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    await loginPage.expectToBeRedirectedToDashboard();

    // Logout
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label="User menu"]');
    await userMenu.click();

    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Sign out")');
    await logoutButton.click();

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);

    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/patients');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
