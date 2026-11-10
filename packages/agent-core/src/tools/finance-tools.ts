import { ToolDefinition } from '../contracts/agent.js';

export const defaultFinanceTools: ToolDefinition[] = [
  {
    name: 'get_portfolio_balance',
    description: 'Kullanıcının yerel DuckDB/SQLite üzerinde kayıtlı portföy bakiyesini getirir.',
    parameters: {
      type: 'object',
      properties: {
        currency: { type: 'string', default: 'USD' }
      }
    },
    handler: async (args) => {
      return {
        currency: args.currency || 'USD',
        totalValue: 48520.50,
        assets: [
          { symbol: 'BTC', amount: 0.45, valueUsd: 38250 },
          { symbol: 'ETH', amount: 2.5, valueUsd: 7500 },
          { symbol: 'USDT', amount: 2770.50, valueUsd: 2770.50 }
        ]
      };
    }
  },
  {
    name: 'calculate_rsi',
    description: 'Verilen fiyat dizisi için RSI (Relative Strength Index) hesaplar.',
    parameters: {
      type: 'object',
      properties: {
        symbol: { type: 'string' },
        period: { type: 'number', default: 14 }
      },
      required: ['symbol']
    },
    handler: async (args) => {
      return {
        symbol: args.symbol,
        period: args.period || 14,
        currentRSI: 64.25,
        signal: 'NEUTRAL'
      };
    }
  }
];
