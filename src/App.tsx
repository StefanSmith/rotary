import { useState, useEffect } from 'react';

// Google API configuration from environment variables
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function App() {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  useEffect(() => {
    waitForGoogleAPIs();
  }, []);

  const waitForGoogleAPIs = () => {
    if (typeof window.gapi !== 'undefined' && typeof window.google !== 'undefined') {
      initializeGoogleApi();
    } else {
      setTimeout(waitForGoogleAPIs, 100);
    }
  };

  const initializeGoogleApi = async () => {
    if (!CLIENT_ID || !API_KEY) {
      console.error('Missing Google API credentials. Set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY environment variables');
      return;
    }

    try {
      await new Promise<void>((resolve) => {
        window.gapi.load('client', resolve);
      });

      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });

      setIsApiLoaded(true);
    } catch (error) {
      console.error('Failed to initialize Google API:', error);
    }
  };

  const handleGenerateRota = async () => {
    if (!isApiLoaded) {
      console.error('Google API not ready');
      return;
    }

    try {
      if (!isAuthorized) {
        await authorize();
      }
      await createRotaSpreadsheet();
    } catch (error) {
      console.error('Error generating rota:', error);
    }
  };

  const authorize = async () => {
    return new Promise<void>((resolve, reject) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID!,
        scope: SCOPES,
        callback: (tokenResponse: any) => {
          if (tokenResponse.error !== undefined) {
            reject(tokenResponse);
            return;
          }
          setIsAuthorized(true);
          resolve();
        },
      });
      tokenClient.requestAccessToken();
    });
  };

  const createRotaSpreadsheet = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.create({
        properties: {
          title: `CMU A Rota - ${new Date().toISOString().split('T')[0]}`
        }
      });

      const url = response.result.spreadsheetUrl;
      setSpreadsheetUrl(url);
    } catch (error) {
      console.error('Failed to create spreadsheet:', error);
    }
  };

  return (
    <div>
      <h1>Rotary</h1>
      <button onClick={handleGenerateRota} disabled={!isApiLoaded}>Generate Rota</button>
      {spreadsheetUrl && (
        <p>
          <a href={spreadsheetUrl} target="_blank" rel="noopener noreferrer">
            Open Spreadsheet
          </a>
        </p>
      )}
    </div>
  )
}

export default App
