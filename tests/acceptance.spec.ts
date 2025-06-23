import { test, expect } from '@playwright/test';

test('displays generate rota button', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByRole('button', { name: /generate rota/i })).toBeVisible();
});