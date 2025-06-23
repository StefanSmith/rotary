import type { RotaInfo } from '../domain/rota';

export interface SpreadsheetCreationResult {
  url: string;
}

export interface SpreadsheetPort {
  initialize(): Promise<void>;
  createSpreadsheet(rotaInfo: RotaInfo): Promise<SpreadsheetCreationResult>;
}