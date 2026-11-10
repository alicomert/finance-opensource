import { z } from 'zod';

export const ClientHandshakeSchema = z.object({
  clientType: z.enum(['desktop', 'mobile', 'cli', 'bot']),
  version: z.string(),
  authToken: z.string().optional()
});

export const AgentPromptRequestSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  driver: z.enum(['pi', 'claude-code', 'codex', 'ollama', 'mock']).default('mock'),
  prompt: z.string(),
  stream: z.boolean().default(true)
});

export const IndicatorRequestSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']),
  indicator: z.enum(['RSI', 'MACD', 'EMA', 'SMA', 'BOLLINGER']),
  period: z.number().optional()
});

export type ClientHandshake = z.infer<typeof ClientHandshakeSchema>;
export type AgentPromptRequest = z.infer<typeof AgentPromptRequestSchema>;
export type IndicatorRequest = z.infer<typeof IndicatorRequestSchema>;
