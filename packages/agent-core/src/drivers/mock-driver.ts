import { IAgentDriver, AgentDriverType, ToolDefinition, AgentMessage, AgentStreamChunk } from '../contracts/agent.js';

export class MockAgentDriver implements IAgentDriver {
  readonly driverType: AgentDriverType = 'mock';
  private tools: Map<string, ToolDefinition> = new Map();

  async initialize(_config: { apiKey?: string; localEndpoint?: string; model?: string }): Promise<void> {
    // Deterministik test ortamı için hazırlık
  }

  registerTools(tools: ToolDefinition[]): void {
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  async createSession(_sessionId: string): Promise<void> {}

  async sendMessage(
    _sessionId: string,
    prompt: string,
    onStream: (chunk: AgentStreamChunk) => void
  ): Promise<AgentMessage> {
    onStream({ type: 'status-update', status: 'Thinking...' });
    onStream({ type: 'text-delta', delta: `[MOCK-AI Yanıtı] "${prompt}" sorgusu işlendi.` });

    return {
      id: `mock-msg-${Date.now()}`,
      role: 'assistant',
      content: `[MOCK-AI Yanıtı] "${prompt}" sorgusu başarıyla simüle edildi.`,
      createdAt: Date.now()
    };
  }

  async abort(_sessionId: string): Promise<void> {}
}
