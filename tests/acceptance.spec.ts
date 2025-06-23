import { test, expect } from '@playwright/test';

test('displays generate rota button', async ({ page }) => {
  // Mock window.open BEFORE navigating to the page
  await page.addInitScript(() => {
    window.openedUrls = [];
    window.originalOpen = window.open;
    window.open = (url) => {
      window.openedUrls.push(url);
      return { focus: () => {} };
    };
  });
  
  await page.goto('http://localhost:5173');
  await expect(page.getByRole('button', { name: /generate rota/i })).toBeVisible();
  
  // Click generate rota button
  await page.getByRole('button', { name: /generate rota/i }).click();
  
  // Verify window.open was called with Google Sheets URL
  const openedUrls = await page.evaluate(() => window.openedUrls);
  expect(openedUrls).toContain('https://docs.google.com/spreadsheets/d/test-sheet-id');
});