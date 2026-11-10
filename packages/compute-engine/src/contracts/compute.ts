export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestParams {
  symbol: string;
  timeframe: '1m' | '5m' | '1h' | '1d';
  startDate: number;
  endDate: number;
  initialCapital: number;
  strategyCode: string;
}

export interface BacktestResult {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  equityCurve: Array<{ timestamp: number; equity: number }>;
}

export interface IComputeEngine {
  calculateRSI(candles: Candle[], period?: number): number[];
  calculateMACD(candles: Candle[], fast?: number, slow?: number, signal?: number): {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
  runBacktest(params: BacktestParams): Promise<BacktestResult>;
}
