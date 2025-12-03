import { test, expect } from '@playwright/test';

test.describe('Enhanced RSVP Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete RSVP submission with Radix UI components', async ({ page }) => {
    // Fill name
    await page.getByLabel(/nama penuh/i).fill('Ahmad bin Abdullah');

    // Select radio option using Radix UI
    await page.getByRole('radio', { name: /hadir/i }).click();

    // Verify radio is checked
    await expect(page.getByRole('radio', { name: /hadir/i })).toBeChecked();

    // Wait for number input to appear
    await expect(page.getByLabel(/bilangan orang/i)).toBeVisible();

    // Use number input controls - click plus button twice
    const plusButton = page.getByLabel(/tambahkan bilangan/i);
    await plusButton.click();
    await plusButton.click(); // Total: 3 people (starts at 1, becomes 3)

    // Verify input value
    const numberInput = page.getByLabel(/bilangan orang/i);
    await expect(numberInput).toHaveValue('3');

    // Submit form
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Verify loading state appears
    await expect(page.getByText(/menghantar/i)).toBeVisible();

    // Verify success message appears
    await expect(page.getByText(/terima kasih/i)).toBeVisible({ timeout: 10000 });
  });

  test('radio group clears number input when tidak hadir selected', async ({ page }) => {
    // Fill name
    await page.getByLabel(/nama penuh/i).fill('Test User');

    // Select hadir
    await page.getByRole('radio', { name: /hadir/i }).click();

    // Wait for number input to appear
    await expect(page.getByLabel(/bilangan orang/i)).toBeVisible();

    // Click plus button to increment
    await page.getByLabel(/tambahkan bilangan/i).click();

    // Verify input has value (should be 2 after one click from default 1)
    await expect(page.getByLabel(/bilangan orang/i)).toHaveValue('2');

    // Switch to tidak hadir
    await page.getByRole('radio', { name: /tidak hadir/i }).click();

    // Number input should disappear
    await expect(page.getByLabel(/bilangan orang/i)).not.toBeVisible();
  });

  test('keyboard navigation works in radio group', async ({ page }) => {
    // Fill name and tab to radio group
    await page.getByLabel(/nama penuh/i).fill('Keyboard User');
    await page.keyboard.press('Tab');

    // Should focus first radio
    await expect(page.getByRole('radio', { name: /hadir/i })).toBeFocused();

    // Arrow down to second radio
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /tidak hadir/i })).toBeFocused();

    // Space to select
    await page.keyboard.press('Space');
    await expect(page.getByRole('radio', { name: /tidak hadir/i })).toBeChecked();
  });

  test('number input respects min/max bounds', async ({ page }) => {
    await page.getByLabel(/nama penuh/i).fill('Boundary Test');
    await page.getByRole('radio', { name: /hadir/i }).click();

    // Wait for number input controls to appear
    await expect(page.getByLabel(/bilangan orang/i)).toBeVisible();

    const minusButton = page.getByLabel(/kurangkan bilangan/i);
    const plusButton = page.getByLabel(/tambahkan bilangan/i);
    const numberInput = page.getByLabel(/bilangan orang/i);

    // Initially should be at min (1 or undefined), minus should be disabled
    await expect(minusButton).toBeDisabled();

    // Click plus to increment up to max (20)
    for (let i = 0; i < 20; i++) {
      if (await plusButton.isEnabled()) {
        await plusButton.click();
        // Small delay to allow state update
        await page.waitForTimeout(50);
      } else {
        break;
      }
    }

    // Should be at max (20), plus button should be disabled
    await expect(numberInput).toHaveValue('20');
    await expect(plusButton).toBeDisabled();
  });

  test('form validation shows errors', async ({ page }) => {
    // Submit empty form
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Should show validation errors
    // Wait a bit for validation to trigger
    await page.waitForTimeout(500);

    // Check for error messages - these may vary based on your validation schema
    const errorMessages = page.locator('[class*="text-error"], [class*="error"]');
    await expect(errorMessages.first()).toBeVisible();
  });
});
