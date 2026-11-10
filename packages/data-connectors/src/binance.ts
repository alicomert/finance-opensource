import { IMarketConnector, StandardTicker } from './contracts.js';
import { MarketDataNormalizer } from './normalizer.js';

export class BinanceConnector implements IMarketConnector {
  readonly name = 'binance';
  private timer?: NodeJS.Timeout;

  async connect(): Promise<void> {
    // REST + WebSocket bağlantısı
  }

  async disconnect(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
  }

  subscribeTicker(symbol: string, onTick: (ticker: StandardTicker) => void): void {
    // Demo simülasyon akışı
    let mockPrice = symbol.includes('BTC') ? 85000 : 2500;
    this.timer = setInterval(() => {
      mockPrice += (Math.random() - 0.5) * 10;
      onTick(MarketDataNormalizer.normalizeTicker({
        symbol,
        price: mockPrice,
        time: Date.now()
      }, this.name));
    }, 1000);
  }

  async getHistoricalCandles(_symbol: string, _timeframe: string, _limit: number): Promise<unknown[]> {
    return [];
  }
}
