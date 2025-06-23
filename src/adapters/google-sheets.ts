import type { SpreadsheetPort, SpreadsheetCreationResult } from '../ports/spreadsheet';
import type { RotaInfo } from '../domain/rota';

export class GoogleSheetsAdapter implements SpreadsheetPort {
  private readonly clientId: string;
  private readonly apiKey: string;
  private readonly discoveryDoc: string;
  private readonly scopes: string;
  private isAuthorized: boolean = false;

  constructor(
    clientId: string,
    apiKey: string,
    discoveryDoc: string = 'https://sheets.googleapis.com/$discovery/rest?version=v4',
    scopes: string = 'https://www.googleapis.com/auth/drive.file'
  ) {
    this.clientId = clientId;
    this.apiKey = apiKey;
    this.discoveryDoc = discoveryDoc;
    this.scopes = scopes;
  }

  async initialize(): Promise<void> {
    if (!this.clientId || !this.apiKey) {
      throw new Error('Missing Google API credentials');
    }

    await this.waitForGoogleAPIs();
    await this.initializeGoogleApi();
  }


  async createSpreadsheet(rotaInfo: RotaInfo): Promise<SpreadsheetCreationResult> {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    const response = await window.gapi.client.sheets.spreadsheets.create({
      properties: {
        title: rotaInfo.title
      }
    });

    return {
      url: response.result.spreadsheetUrl
    };
  }

  private waitForGoogleAPIs(): Promise<void> {
    return new Promise((resolve) => {
      const checkAPIs = () => {
        if (typeof window.gapi !== 'undefined' && typeof window.google !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkAPIs, 10);
        }
      };
      checkAPIs();
    });
  }

  private async initializeGoogleApi(): Promise<void> {
    await new Promise<void>((resolve) => {
      window.gapi.load('client', resolve);
    });

    await window.gapi.client.init({
      apiKey: this.apiKey,
      discoveryDocs: [this.discoveryDoc],
    });
  }

  private authorize(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scopes,
        callback: (tokenResponse: any) => {
          if (tokenResponse.error !== undefined) {
            reject(new Error(tokenResponse.error));
            return;
          }
          this.isAuthorized = true;
          resolve();
        },
      });
      tokenClient.requestAccessToken();
    });
  }
}