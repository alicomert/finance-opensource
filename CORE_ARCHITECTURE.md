# Açık Finans Çekirdeği: Değiştirilebilir Motor ve Yerel Mimari Planı (CORE_ARCHITECTURE.md)

Bu belge, **Pi**, **Claude Code** ve **Codex** gibi farklı yapay zekâ kodlama ve akıl yürütme motorlarının birbirinin yerine takılabildiği; tüm ağır hesaplama yükünün kullanıcının bilgisayarında (PC) koştuğu; mobil ve masaüstü arayüzlerinin hafif istemci olarak çalıştığı modüler finans platformunun mimari planı ve klasör yapısıdır.

---

## 1. Mimari Prensipler ve Tasarım Kararları

1. **Ağır Hesaplama PC'de (Local-First Compute Daemon):**
   - Veri tabanı (DuckDB / SQLite), indikatör hesaplamaları, backtest simülasyonları, OCR ve veri çekme işlemleri PC'de çalışan yerel arka plan servisinde (`daemon / core`) çalışır.
   - Mobil (iOS/Android) ve masaüstü (Desktop UI) arayüzleri, bu yerel servise gRPC / WebSocket üzerinden bağlanır. Mobil cihaz pil tüketmez, ısınmaz ve veri işleme yükü altına girmez.

2. **Değiştirilebilir Ajan Katmanı (Swappable Agent Abstraction):**
   - Cindy'nin `BaseAgent` yapısına benzer şekilde, tüm yapay zekâ motorları ortak bir `IAgentDriver` kontratını uygular.
   - Üst katman (finans modülleri, emir ekranları, grafik analizcisi); arkada **Pi**, **Claude Code**, **Codex** veya **yerel bir Ollama** modeli çalıştığını bilmez. Aynı araç setini (MCP Tools), olay akışını (stream events) ve hafıza protokolünü kullanır.

3. **Çoklu Çalışma Alanı Görünümü (Multi-View UI Matrix):**
   - Tek bir durum ve veri modeli üzerinde 3 farklı bakış açısı:
     - **TradingView Modu:** Tam ekran mum grafikleri, indikatörler, çizim araçları, strateji script editörü.
     - **Binance Modu:** Profesyonel çok pencereli terminal, derinlik tablosu, anlık işlemler, emir paneli.
     - **ChatGPT / Asistan Modu:** Doğal dille finansal analiz, portföy sorguları, otomatik raporlama ve zengin kartlar (kart/widget yanıtları).

4. **Yapay Zekâ ile Kodlamaya ve Teste Uygunluk (AI-Friendly & Headless Testing):**
   - Sıkı TypeScript tipleri ve Zod şemaları ile tanımlanmış veri kontratları.
   - LLM'lerin ve geliştiricilerin tek bir test komutuyla (`pnpm test:headless`) tüm motoru terminalden test edebilmesini sağlayan bağımlılık enjeksiyonu ve Mock Agent altyapısı.

---

## 2. Monorepo Klasör Yapısı

Monorepo standardı: **pnpm workspaces** + **Turborepo**

```text
finance-core/
├── package.json                         # Workspace kök yapılandırması
├── pnpm-workspace.yaml                  # Monorepo paket yolları
├── turbo.json                           # Derleme ve test pipeline yönetimi
├── tsconfig.base.json                   # Paylaşılan TypeScript ayarları
├── .env.example                         # Örnek çevre değişkenleri
│
├── apps/                                # Kullanıcı Arayüzleri & Dağıtılabilir Uygulamalar
│   ├── desktop/                         # Masaüstü uygulaması (Tauri / Electron)
│   │   ├── src-tauri/                   # Tauri Rust arka uç (hızlı PC pencere yöneticisi)
│   │   ├── src/                         # Arayüz giriş noktası (React / Svelte / Solid)
│   │   └── package.json
│   │
│   ├── mobile/                          # Hafif mobil eşlikçi uygulama (Expo / React Native)
│   │   ├── src/                         # Tablet/Telefon arayüzü, mDNS yerel eşleşme
│   │   └── package.json
│   │
│   └── daemon/                          # PC'de arka planda koşan yerel servis (Headless Node.js/Rust)
│       ├── src/
│       │   ├── server.ts                # WebSocket & gRPC sunucu ucu (IPC)
│       │   ├── discovery.ts             # Yerel ağ mDNS/Bonjour duyuru (Mobilin PC'yi bulması için)
│       │   └── index.ts
│       └── package.json
│
├── packages/                            # Bağımsız, Tekrar Kullanılabilir Paketler
│   │
│   ├── agent-core/                      # [ÇEKİRDEK 1] Değiştirilebilir Ajan İskeleti
│   │   ├── src/
│   │   │   ├── contracts/               # IAgentDriver, AgentSession, Message, StreamEvent
│   │   │   ├── drivers/                 # Motor sürücüleri (Adaptörler)
│   │   │   │   ├── pi-driver.ts         # Pi CLI / Harness adaptörü
│   │   │   │   ├── claude-code-driver.ts# Claude Code API/Harness adaptörü
│   │   │   │   ├── codex-driver.ts      # Codex adaptörü
│   │   │   │   └── mock-driver.ts       # Testler için sıfır maliyetli deterministik sahte motor
│   │   │   ├── tools/                   # Ajanlara açılan finansal araçlar (MCP standardı)
│   │   │   │   ├── registry.ts          # Araç kayıt merkezi
│   │   │   │   └── finance-tools.ts     # get_balance, run_backtest, get_orderbook, calculate_rsi
│   │   │   ├── memory/                  # Oturum ve kalıcı hafıza yöneticisi
│   │   │   └── manager.ts               # Çalışma anında motor değiştiren AgentEngineManager
│   │   └── package.json
│   │
│   ├── compute-engine/                  # [ÇEKİRDEK 2] Ağır Hesaplama ve İndikatör Motoru
│   │   ├── src/
│   │   │   ├── math/                    # İndikatör hesaplamaları (RSI, MACD, Bollinger, EMA)
│   │   │   ├── backtest/                # Geçmişe dönük strateji simülasyon motoru
│   │   │   ├── portfolio/               # Risk, getiri, Sharpe oranı, drawdown metrikleri
│   │   │   ├── ocr/                     # Fatura, dekont, ekstre ayrıştırıcı (yerel Tesseract/ONNX)
│   │   │   └── storage/                 # DuckDB / SQLite yerel hızlı veri tabanı katmanı
│   │   └── package.json
│   │
│   ├── data-connectors/                 # [ÇEKİRDEK 3] Piyasa & Veri Sağlayıcıları
│   │   ├── src/
│   │   │   ├── contracts/               # IDataProvider, Ticker, Candle, OrderBook kontratları
│   │   │   ├── providers/
│   │   │   │   ├── binance/             # Binance REST + WebSocket adaptörü
│   │   │   │   ├── kraken/              # Kraken REST + WebSocket adaptörü
│   │   │   │   ├── fred/                # FRED makroekonomik seri adaptörü
│   │   │   │   ├── evds/                # TCMB EVDS adaptörü
│   │   │   │   └── csv-importer/        # Excel / CSV yerel dosya okuyucu
│   │   │   ├── cache/                   # Yerel önbellekleme ve kota/hız sınırlayıcı (Rate limiter)
│   │   │   └── normalizer.ts            # Farklı borsalardan gelen verileri standart tipe çeviren motor
│   │   └── package.json
│   │
│   ├── ui-workspaces/                   # [ARAYÜZ KATMANI] Görünümler ve Bileşenler
│   │   ├── src/
│   │   │   ├── tradingview-view/        # Mum grafiği, çizim araçları, gösterge paneli
│   │   │   ├── binance-view/            # Emir defteri, derinlik, hızlı işlem bileşenleri
│   │   │   ├── chat-view/               # AI konuşma akışı, etkileşimli finansal kartlar
│   │   │   ├── shared/                  # Ortak düğmeler, pencereler, tablolar
│   │   │   └── layout-engine/           # Çalışma alanları arası pencereli/sekmeli yerleşim yöneticisi
│   │   └── package.json
│   │
│   ├── protocol/                        # PC Daemon ile İstemciler Arası İletişim Tipleri
│   │   ├── src/
│   │   │   ├── messages.ts              # WebSocket/IPC üzerinden akan mesaj şemaları (Zod)
│   │   │   └── events.ts                # Fiyat güncelleme, emir durumu, ajan akış olayları
│   │   └── package.json
│   │
│   └── updater/                         # Uygulama ve Eklenti Güncelleme Modülü
│       ├── src/
│       │   ├── binary-updater.ts        # PC daemon ve masaüstü ikili dosya güncelleme kontrolü
│       │   └── plugin-updater.ts        # Yeni borsa/strateji eklentilerinin dinamik yüklenmesi
│       └── package.json
│
└── tests/                               # Bütünleşik ve Otomatik Testler
    ├── unit/                            # İndikatör, matematik ve veri normalizasyon testleri
    ├── integration/                     # Daemon <-> Client bağlantı testleri
    ├── agent/                           # Pi, Claude Code, Codex sürücü soyutlama testleri
    └── mocks/                           # Sahte piyasa verileri ve borsa yanıtları
```

---

## 3. Somut Çekirdek Arayüzleri (TypeScript Kod Şablonları)

### 3.1. Değiştirilebilir Ajan Sürücüsü Kontratı (`packages/agent-core/src/contracts/agent.ts`)

```typescript
export type AgentDriverType = 'pi' | 'claude-code' | 'codex' | 'ollama' | 'mock';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  handler: (args: any, context: ExecutionContext) => Promise<any>;
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
```

### 3.2. Ajan Yöneticisi: Çalışma Anında Motor Değiştirme (`packages/agent-core/src/manager.ts`)

```typescript
import { IAgentDriver, AgentDriverType, ToolDefinition } from './contracts/agent';

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
   * Kullanıcı tek tıkla veya komutla Pi -> Claude Code -> Codex geçişi yapabilir.
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
}
```

### 3.3. Ağır Hesaplama ve İndikatör Motoru Kontratı (`packages/compute-engine/src/contracts/compute.ts`)

```typescript
export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestParams {
  symbol: string;
  timeframe: '1m' | '5m' | '1h' | '1d';
  startDate: number;
  endDate: number;
  initialCapital: number;
  strategyCode: string; // JavaScript/Python veya görsel kural tanımı
}

export interface BacktestResult {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  equityCurve: Array<{ timestamp: number; equity: number }>;
}

export interface IComputeEngine {
  calculateRSI(candles: Candle[], period?: number): number[];
  calculateMACD(candles: Candle[], fast?: number, slow?: number, signal?: number): {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
  runBacktest(params: BacktestParams): Promise<BacktestResult>;
}
```

---

## 4. İletişim Akışı: PC Motoru ile İstemciler (Masaüstü ve Mobil)

```text
[Mobil / Tablet İstemci]      [Masaüstü UI (Tauri)]
       \                              /
        \                            /
    (Yerel WebSocket / TLS / IPC Üzerinden)
                  \        /
                   v      v
      +--------------------------------+
      |      PC DAEMON (Local Core)    |
      |  (Bütün ağır işler burada)     |
      +--------------------------------+
             |                  |
             v                  v
     +---------------+  +------------------+
     | Ajan Katmanı  |  | Hesaplama Motoru |
     | (Pi / Claude/ |  | (DuckDB, Backtest|
     |  Codex / Loc) |  |  İndikatör, OCR) |
     +---------------+  +------------------+
             |                  |
             +--------+---------+
                      |
                      v
            [Piyasa Bağlayıcıları]
          (Binance / Kraken / EVDS)
```

1. **PC Daemon Başlatılır:** Bilgisayarda arka plan servisi ayağa kalkar, yerel SQLite/DuckDB veri tabanını açar ve `ws://127.0.0.1:4820` (ve yerel LAN IP) üzerinden dinlemeye başlar.
2. **Keşif (Discovery):** PC daemon mDNS yayını yapar (`_finance-core._tcp`). Mobil cihaz aynı Wi-Fi ağındayken PC'yi otomatik bulur ve QR kod ile eşleşir.
3. **Sıfır Bulut Bağımlılığı (İsteğe Bağlı):** Tüm portföy geçmişi, borsa API anahtarları ve stratejiler yalnızca PC diskinde şifreli tutulur.
4. **Hafif İstemci Prensibi:** Telefon ekranında 100.000 mumluk bir backtest başlatıldığında, hesaplama telefonda değil PC'de koşar. Telefona yalnızca sıkıştırılmış özet metrikler ve görselleştirilecek grafiğin veri noktaları gönderilir.

---

## 5. Test ve Kolay Geliştirme Stratejisi

- **Mock Ajan ile Test (`mock-driver.ts`):** Birim testlerde LLM API'lerine para harcamadan ve bekleme süresi olmadan önceden tanımlanmış araç çağrıları simüle edilir.
- **Deterministik Backtest Testleri:** Bilinen sentetik mum dizileriyle RSI, MACD ve kâr/zarar hesaplamaları ondalık basamak hassasiyetinde test edilir.
- **Tek Komutla Headless Doğrulama:**
  - `pnpm test` -> Tüm paketlerin birim testlerini koşar.
  - `pnpm test:e2e` -> Sahte veri akışı başlatıp PC Daemon ile İstemci arasındaki haberleşmeyi doğrular.
