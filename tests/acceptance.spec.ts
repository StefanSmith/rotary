import {expect, test} from '@playwright/test';
import {ensureGoogleAuthLibraryAlwaysVendsToken, ensureGoogleApiLibraryAlwaysGeneratesGoogleSheet} from './support/google-mocks';

test('generates rota and provides Google Sheets link', async ({page}) => {
    await ensureGoogleAuthLibraryAlwaysVendsToken(page);
    await ensureGoogleApiLibraryAlwaysGeneratesGoogleSheet('https://docs.google.com/spreadsheets/d/test-sheet-id', page);

    await page.goto('http://localhost:5173');

    const generateButton = page.getByRole('button', {name: /generate rota/i});
    await expect(generateButton).toBeEnabled({timeout: 5000});
    await generateButton.click();

    const spreadsheetLink = page.getByRole('link', {name: /open spreadsheet/i});
    await expect(spreadsheetLink).toBeVisible({timeout: 5000});
    await expect(spreadsheetLink).toHaveAttribute('href', 'https://docs.google.com/spreadsheets/d/test-sheet-id');
});