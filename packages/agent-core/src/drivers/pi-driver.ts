import { IAgentDriver, AgentDriverType, ToolDefinition, AgentMessage, AgentStreamChunk } from '../contracts/agent.js';

export class PiAgentDriver implements IAgentDriver {
  readonly driverType: AgentDriverType = 'pi';
  private tools: Map<string, ToolDefinition> = new Map();
  private endpoint: string = 'http://127.0.0.1:4040';

  async initialize(config: { apiKey?: string; localEndpoint?: string; model?: string }): Promise<void> {
    if (config.localEndpoint) this.endpoint = config.localEndpoint;
  }

  registerTools(tools: ToolDefinition[]): void {
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  async createSession(_sessionId: string): Promise<void> {}

  async sendMessage(
    sessionId: string,
    prompt: string,
    onStream: (chunk: AgentStreamChunk) => void
  ): Promise<AgentMessage> {
    onStream({ type: 'status-update', status: 'Pi CLI motoru devrede...' });
    
    // Pi RPC / Subprocess entegrasyon kanalı
    const content = `[Pi Driver]: "${prompt}" işlendi. Aktif araç sayısı: ${this.tools.size}`;
    onStream({ type: 'text-delta', delta: content });

    return {
      id: `pi-msg-${Date.now()}`,
      role: 'assistant',
      content,
      createdAt: Date.now()
    };
  }

  async abort(_sessionId: string): Promise<void> {}
}
