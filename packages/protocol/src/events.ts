import { z } from 'zod';

export const PriceTickEventSchema = z.object({
  type: z.literal('price-tick'),
  symbol: z.string(),
  price: z.number(),
  timestamp: z.number()
});

export const CandleCloseEventSchema = z.object({
  type: z.literal('candle-close'),
  symbol: z.string(),
  timeframe: z.string(),
  candle: z.object({
    timestamp: z.number(),
    open: z.number(),
    high: z.number(),
    low: z.number(),
    close: z.number(),
    volume: z.number()
  })
});

export const AgentStreamEventSchema = z.object({
  type: z.literal('agent-stream'),
  sessionId: z.string(),
  chunkType: z.enum(['text-delta', 'tool-call-start', 'tool-call-done', 'status-update']),
  delta: z.string().optional(),
  status: z.string().optional()
});

export type PriceTickEvent = z.infer<typeof PriceTickEventSchema>;
export type CandleCloseEvent = z.infer<typeof CandleCloseEventSchema>;
export type AgentStreamEvent = z.infer<typeof AgentStreamEventSchema>;
