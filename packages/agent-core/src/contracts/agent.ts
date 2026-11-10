export type AgentDriverType = 'pi' | 'claude-code' | 'codex' | 'ollama' | 'mock';

export interface ExecutionContext {
  userId: string;
  sessionId: string;
  timestamp: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  handler: (args: Record<string, unknown>, context: ExecutionContext) => Promise<unknown>;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: Array<{
    id: string;
    toolName: string;
    arguments: Record<string, unknown>;
  }>;
  createdAt: number;
}

export interface AgentStreamChunk {
  type: 'text-delta' | 'tool-call-start' | 'tool-call-done' | 'status-update';
  delta?: string;
  toolCall?: {
    id: string;
    toolName: string;
    arguments?: Record<string, unknown>;
    result?: unknown;
  };
  status?: string;
}

/**
 * Pi, Claude Code veya Codex bu arayüzü uygular.
 * Ajan değiştirildiğinde yalnızca bu adaptör sınıfı değişir.
 */
export interface IAgentDriver {
  readonly driverType: AgentDriverType;
  
  initialize(config: { apiKey?: string; localEndpoint?: string; model?: string }): Promise<void>;
  
  registerTools(tools: ToolDefinition[]): void;
  
  createSession(sessionId: string): Promise<void>;
  
  sendMessage(
    sessionId: string,
    prompt: string,
    onStream: (chunk: AgentStreamChunk) => void
  ): Promise<AgentMessage>;
  
  abort(sessionId: string): Promise<void>;
}
