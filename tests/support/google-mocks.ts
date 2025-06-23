import type {Page} from '@playwright/test';

export async function ensureGoogleApiLibraryAlwaysGeneratesGoogleSheet(spreadsheetUrl: string, page: Page) {
    await page.route('**/apis.google.com/js/api.js', async route => {
        await route.fulfill({
            status: 200,
            headers: {'Content-Type': 'application/javascript'},
            body: `
        window.gapi = {
          load: (name, callback) => callback(),
          client: {
            init: () => Promise.resolve(),
            sheets: {
              spreadsheets: {
                create: () => Promise.resolve({
                  result: {
                    spreadsheetUrl: '${spreadsheetUrl}'
                  }
                })
              }
            }
          }
        };
      `
        });
    });
}

export async function ensureGoogleAuthLibraryAlwaysVendsToken(page: Page) {
    await page.route('**/accounts.google.com/gsi/client', async route => {
        await route.fulfill({
            status: 200,
            headers: {'Content-Type': 'application/javascript'},
            body: `
        window.google = {
          accounts: {
            oauth2: {
              initTokenClient: (options) => ({
                requestAccessToken: () => {
                  options.callback({ access_token: 'any-token' });
                }
              })
            }
          }
        };
      `
        });
    });
}