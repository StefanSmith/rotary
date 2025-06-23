import { useState, useEffect } from 'react';
import { RotaService } from './domain/rota';
import type { SpreadsheetPort } from './ports/spreadsheet';
import { GoogleSheetsAdapter } from './adapters/google-sheets';

// Google API configuration from environment variables
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function App() {
  const [isReady, setIsReady] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [rotaService] = useState(() => new RotaService());
  const [spreadsheetAdapter] = useState<SpreadsheetPort>(() =>
    new GoogleSheetsAdapter(CLIENT_ID!, API_KEY!)
  );

  useEffect(() => {
    spreadsheetAdapter.initialize()
      .then(() => setIsReady(true))
      .catch(error => console.error('Failed to initialize services:', error));
  }, [spreadsheetAdapter]);

  const handleGenerateRota = async () => {
    try {
      const rotaInfo = rotaService.createRotaInfo();
      const result = await spreadsheetAdapter.createSpreadsheet(rotaInfo);
      setSpreadsheetUrl(result.url);
    } catch (error) {
      console.error('Error generating rota:', error);
    }
  };

  return (
    <div>
      <h1>Rotary</h1>
      <button onClick={handleGenerateRota} disabled={!isReady}>Generate Rota</button>
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
