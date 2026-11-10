import { IAgentDriver, AgentDriverType, ToolDefinition, AgentMessage, AgentStreamChunk } from '../contracts/agent.js';

export class ClaudeCodeDriver implements IAgentDriver {
  readonly driverType: AgentDriverType = 'claude-code';
  private tools: Map<string, ToolDefinition> = new Map();
  private apiKey?: string;

  async initialize(config: { apiKey?: string; localEndpoint?: string; model?: string }): Promise<void> {
    this.apiKey = config.apiKey;
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
    onStream({ type: 'status-update', status: 'Claude Code Agent API çağrılıyor...' });
    
    const content = `[Claude Code Driver]: "${prompt}" analiz edildi.`;
    onStream({ type: 'text-delta', delta: content });

    return {
      id: `claude-msg-${Date.now()}`,
      role: 'assistant',
      content,
      createdAt: Date.now()
    };
  }

  async abort(_sessionId: string): Promise<void> {}
}
