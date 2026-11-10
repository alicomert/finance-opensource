import { IAgentDriver, AgentDriverType, ToolDefinition } from './contracts/agent.js';

export class AgentEngineManager {
  private activeDriver: IAgentDriver;
  private drivers = new Map<AgentDriverType, IAgentDriver>();
  private sharedTools: ToolDefinition[] = [];

  constructor(defaultDriver: IAgentDriver) {
    this.activeDriver = defaultDriver;
    this.drivers.set(defaultDriver.driverType, defaultDriver);
  }

  public registerDriver(driver: IAgentDriver): void {
    driver.registerTools(this.sharedTools);
    this.drivers.set(driver.driverType, driver);
  }

  public registerSharedTools(tools: ToolDefinition[]): void {
    this.sharedTools.push(...tools);
    for (const driver of this.drivers.values()) {
      driver.registerTools(tools);
    }
  }

  /**
   * Çalışma anında Pi -> Claude Code -> Codex geçişi sağlar
   */
  public switchDriver(type: AgentDriverType): IAgentDriver {
    const driver = this.drivers.get(type);
    if (!driver) {
      throw new Error(`Sürücü bulunamadı: ${type}`);
    }
    this.activeDriver = driver;
    return this.activeDriver;
  }

  public get current(): IAgentDriver {
    return this.activeDriver;
  }

  public listDrivers(): AgentDriverType[] {
    return Array.from(this.drivers.keys());
  }
}
