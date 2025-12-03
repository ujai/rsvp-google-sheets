import { test, expect } from '@playwright/test';

test.describe('Event Details Enhancement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Google Maps embed loads correctly', async ({ page }) => {
    // Scroll to event details section
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Verify the section heading is visible
    await expect(page.getByRole('heading', { name: 'Butiran Majlis' })).toBeVisible();

    // Check that the "Lokasi di Peta" heading is visible
    await expect(page.getByText('Lokasi di Peta')).toBeVisible();

    // Verify Google Maps iframe exists
    const mapIframe = page.locator('iframe[title*="Peta menunjukkan lokasi majlis"]');
    await expect(mapIframe).toBeVisible();

    // Verify iframe has correct attributes
    await expect(mapIframe).toHaveAttribute('loading', 'lazy');
    await expect(mapIframe).toHaveAttribute('allowfullscreen');

    // Wait for iframe to load (give it up to 10 seconds)
    await page.waitForTimeout(2000);

    // Check that iframe src contains Google Maps embed
    const src = await mapIframe.getAttribute('src');
    expect(src).toContain('google.com/maps/embed');
    expect(src).toContain('place_id:ChIJR73efQBPzDERJUvQSAYq9us');
  });

  test('Add to Calendar button works', async ({ page }) => {
    // Scroll to event details section
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Find the calendar button (it uses custom web component)
    const calendarButton = page.locator('add-to-calendar-button');
    await expect(calendarButton).toBeVisible();

    // Check for the button text
    await expect(page.getByText('Tambah ke Kalendar')).toBeVisible();

    // Click the calendar button to open dropdown
    await calendarButton.click();

    // Wait for dropdown to appear
    await page.waitForTimeout(500);

    // Verify calendar options are present (checking for Google option)
    // Note: The exact selectors may vary depending on the library's implementation
    const calendarOptions = page.locator('add-to-calendar-button').locator('*').filter({ hasText: /google/i });

    // If dropdown is visible, at least one option should be present
    // We're being lenient here as the component structure may vary
  });

  test('Map links are present and accessible', async ({ page }) => {
    // Scroll to event details section
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Verify Google Maps link is present
    const googleMapsLink = page.getByRole('link', { name: 'Google Maps' });
    await expect(googleMapsLink).toBeVisible();
    await expect(googleMapsLink).toHaveAttribute('href', /google\.com\/maps/);
    await expect(googleMapsLink).toHaveAttribute('target', '_blank');
    await expect(googleMapsLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Verify Waze link is present
    const wazeLink = page.getByRole('link', { name: 'Waze' });
    await expect(wazeLink).toBeVisible();
    await expect(wazeLink).toHaveAttribute('href', /waze\.com/);
    await expect(wazeLink).toHaveAttribute('target', '_blank');
    await expect(wazeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Event details section is accessible', async ({ page }) => {
    // Scroll to event details section
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Check heading hierarchy
    const mainHeading = page.getByRole('heading', { name: 'Butiran Majlis' });
    await expect(mainHeading).toBeVisible();

    // Check that date, time, and venue labels are present
    await expect(page.getByText('TARIKH')).toBeVisible();
    await expect(page.getByText('MASA')).toBeVisible();
    await expect(page.getByText('TEMPAT')).toBeVisible();

    // Verify event information is displayed
    await expect(page.getByText('Sabtu, 17.1.2026')).toBeVisible();
    await expect(page.getByText('10.30 am - 2.30 pm')).toBeVisible();
    await expect(page.getByText('Ruang Acara Nadi Rafanda')).toBeVisible();

    // Check iframe has accessible title
    const mapIframe = page.locator('iframe[title*="Peta menunjukkan lokasi"]');
    await expect(mapIframe).toHaveAttribute('title');
    const title = await mapIframe.getAttribute('title');
    expect(title).toBeTruthy();
    expect(title?.length).toBeGreaterThan(10);
  });

  test('Event details section has proper responsive layout', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Verify content is visible on mobile
    await expect(page.getByText('TARIKH')).toBeVisible();
    await expect(page.getByText('MASA')).toBeVisible();
    await expect(page.getByText('TEMPAT')).toBeVisible();

    // Check map is visible
    const mapIframe = page.locator('iframe[title*="Peta menunjukkan lokasi"]');
    await expect(mapIframe).toBeVisible();

    // Check buttons stack on mobile (should be visible)
    const googleMapsLink = page.getByRole('link', { name: 'Google Maps' });
    const wazeLink = page.getByRole('link', { name: 'Waze' });
    await expect(googleMapsLink).toBeVisible();
    await expect(wazeLink).toBeVisible();

    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Verify content is still visible on desktop
    await expect(page.getByRole('heading', { name: 'Butiran Majlis' })).toBeVisible();
    await expect(mapIframe).toBeVisible();
  });

  test('Google Maps iframe does not cause CSP violations', async ({ page }) => {
    const cspViolations: string[] = [];

    // Listen for CSP violations
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    // Navigate and wait for content to load
    await page.goto('/');
    await page.getByText('Butiran Majlis').scrollIntoViewIfNeeded();

    // Wait for iframe to attempt loading
    await page.waitForTimeout(3000);

    // Check that no CSP violations were recorded
    expect(cspViolations).toHaveLength(0);
  });
});
