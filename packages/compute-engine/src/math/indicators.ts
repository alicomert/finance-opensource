import { Candle } from '../contracts/compute.js';

export function calculateSMA(values: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = values.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, v) => acc + v, 0);
      result.push(sum / period);
    }
  }
  return result;
}

export function calculateEMA(values: number[], period: number): number[] {
  const result: number[] = [];
  const k = 2 / (period + 1);
  let prevEMA = NaN;

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      const slice = values.slice(0, period);
      prevEMA = slice.reduce((acc, v) => acc + v, 0) / period;
      result.push(prevEMA);
    } else {
      prevEMA = val * k + prevEMA * (1 - k);
      result.push(prevEMA);
    }
  }
  return result;
}

export function calculateRSI(candles: Candle[], period: number = 14): number[] {
  if (candles.length <= period) return candles.map(() => NaN);

  const closes = candles.map(c => c.close);
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  const rsi: number[] = [NaN]; // index 0 diff yok
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < period - 1; i++) {
    rsi.push(NaN);
  }

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push(100 - (100 / (1 + rs)));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }

  return rsi;
}

export function calculateMACD(
  candles: Candle[],
  fast: number = 12,
  slow: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const closes = candles.map(c => c.close);
  const fastEMA = calculateEMA(closes, fast);
  const slowEMA = calculateEMA(closes, slow);

  const macdLine: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) {
      macdLine.push(NaN);
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
  }

  // Signal line MACD line'ın EMA'sıdır (NaN olmayan kısımlar)
  const validIdx = macdLine.findIndex(v => !isNaN(v));
  const validMacd = validIdx === -1 ? [] : macdLine.slice(validIdx);
  const rawSignal = calculateEMA(validMacd, signalPeriod);

  const signalLine: number[] = [];
  const histogram: number[] = [];

  for (let i = 0; i < macdLine.length; i++) {
    if (i < validIdx) {
      signalLine.push(NaN);
      histogram.push(NaN);
    } else {
      const sig = rawSignal[i - validIdx];
      signalLine.push(sig);
      if (isNaN(sig) || isNaN(macdLine[i])) {
        histogram.push(NaN);
      } else {
        histogram.push(macdLine[i] - sig);
      }
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}
