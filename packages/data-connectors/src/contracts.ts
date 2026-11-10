export interface RawTicker {
  symbol: string;
  price: string | number;
  time: number;
}

export interface StandardTicker {
  symbol: string;
  price: number;
  timestamp: number;
  source: string;
}

export interface IMarketConnector {
  readonly name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribeTicker(symbol: string, onTick: (ticker: StandardTicker) => void): void;
  getHistoricalCandles(symbol: string, timeframe: string, limit: number): Promise<unknown[]>;
}
