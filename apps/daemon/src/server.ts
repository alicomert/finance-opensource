import { AgentEngineManager, MockAgentDriver, PiAgentDriver, defaultFinanceTools } from '@finance/agent-core';
import { SQLiteStorageEngine, DuckDBStorageEngine, calculateRSI } from '@finance/compute-engine';
import { BinanceConnector } from '@finance/data-connectors';
import { DaemonDiscoveryService } from './discovery.js';

export class FinanceDaemonServer {
  private port: number;
  private agentManager: AgentEngineManager;
  private sqlite = new SQLiteStorageEngine();
  private duckdb = new DuckDBStorageEngine();
  private discovery = new DaemonDiscoveryService();
  private binance = new BinanceConnector();

  constructor(port: number = 4820) {
    this.port = port;
    const defaultMock = new MockAgentDriver();
    this.agentManager = new AgentEngineManager(defaultMock);
    this.agentManager.registerDriver(new PiAgentDriver());
    this.agentManager.registerSharedTools(defaultFinanceTools);
  }

  public async start(): Promise<void> {
    console.log(`=======================================================`);
    console.log(`🚀 [Finance PC Daemon] Başlatılıyor... Port: ${this.port}`);
    console.log(`=======================================================`);

    await this.sqlite.initialize('./data/local-sqlite.db');
    await this.duckdb.initialize('./data/local-duckdb.parquet');
    this.discovery.startBroadcast(this.port);

    console.log(`✅ [Storage]: Hibrit motor devrede (SQLite WAL + DuckDB Parquet)`);
    console.log(`✅ [Agent Core]: Sürücüler hazır [${this.agentManager.listDrivers().join(', ')}]`);
    console.log(`✅ [Data Connectors]: Binance akış adaptörü hazır.`);
    console.log(`📡 [Daemon]: İstemciler (Tauri Desktop / Expo Mobile) dinleniyor...`);
  }

  public async stop(): Promise<void> {
    this.discovery.stopBroadcast();
    await this.binance.disconnect();
    await this.sqlite.close();
    await this.duckdb.close();
    console.log(`🛑 [Finance PC Daemon] Güvenli şekilde kapatıldı.`);
  }

  public getManager(): AgentEngineManager {
    return this.agentManager;
  }
}
