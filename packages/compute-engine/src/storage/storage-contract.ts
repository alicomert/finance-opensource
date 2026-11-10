import { Candle } from '../contracts/compute.js';

export interface StorageStats {
  engine: 'sqlite' | 'duckdb' | 'hybrid';
  candleCount: number;
  diskSizeBytes: number;
}

/**
 * Veri tabanı depolama sözleşmesi.
 * SQLite (WAL) ve DuckDB (Sütunsal/Parquet) bu sözleşmeyi uygular.
 */
export interface IStorageEngine {
  readonly engineName: 'sqlite' | 'duckdb';
  initialize(dbPath: string): Promise<void>;
  insertCandles(symbol: string, timeframe: string, candles: Candle[]): Promise<void>;
  queryCandles(symbol: string, timeframe: string, start: number, end: number): Promise<Candle[]>;
  getStats(): Promise<StorageStats>;
  close(): Promise<void>;
}
