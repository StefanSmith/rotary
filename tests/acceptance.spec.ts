import { test, expect } from '@playwright/test';

test('displays generate rota button', async ({ page }) => {

  // Mock Google API loading scripts
  await page.route('**/apis.google.com/js/api.js', async route => {
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/javascript' },
      body: `
        window.gapi = {
          load: (name, callback) => callback(),
          client: {
            init: () => Promise.resolve(),
            sheets: {
              spreadsheets: {
                create: () => Promise.resolve({
                  result: {
                    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/test-sheet-id'
                  }
                })
              }
            }
          }
        };
      `
    });
  });

  await page.route('**/accounts.google.com/gsi/client', async route => {
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/javascript' },
      body: `
        window.google = {
          accounts: {
            oauth2: {
              initTokenClient: (options) => ({
                requestAccessToken: () => {
                  options.callback({ access_token: 'mock-token' });
                }
              })
            }
          }
        };
      `
    });
  });

  
  await page.goto('http://localhost:5173');
  
  // Wait for button to be enabled (APIs loaded)
  await expect(page.getByRole('button', { name: /generate rota/i })).toBeEnabled({ timeout: 5000 });
  
  // Click generate rota button
  await page.getByRole('button', { name: /generate rota/i }).click();
  
  // Wait for spreadsheet link to appear
  await expect(page.getByRole('link', { name: /open spreadsheet/i })).toBeVisible({ timeout: 5000 });
  
  // Verify the link has the correct URL
  const link = page.getByRole('link', { name: /open spreadsheet/i });
  await expect(link).toHaveAttribute('href', 'https://docs.google.com/spreadsheets/d/test-sheet-id');
});