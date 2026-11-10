import { RawTicker, StandardTicker } from './contracts.js';

export class MarketDataNormalizer {
  public static normalizeTicker(raw: RawTicker, source: string): StandardTicker {
    return {
      symbol: raw.symbol.toUpperCase(),
      price: typeof raw.price === 'string' ? parseFloat(raw.price) : raw.price,
      timestamp: raw.time || Date.now(),
      source
    };
  }
}
