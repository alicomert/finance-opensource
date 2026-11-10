# finance-opensource

> **Açık Kaynak Yerel Finans İşletim Sistemi ve Değiştirilebilir Ajan Çekirdeği**
> *Local-First Financial OS with Swappable AI Engine (Pi, Claude Code, Codex)*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Monorepo: Turborepo](https://img.shields.io/badge/monorepo-Turborepo-ef4444.svg)](https://turbo.build/)
[![Package Manager: pnpm](https://img.shields.io/badge/pnpm-10+-f69220.svg)](https://pnpm.io/)
[![TypeScript: 5.8](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)

---

## 🎯 Projenin Amacı ve Vizyonu

**finance-opensource**, finansal egemenliği tamamen bireyin kendi donanımına (PC) teslim eden, bulut bağımlılığını kaldıran ve yapay zekâ motorlarını (Pi, Claude Code, Codex, yerel LLM'ler) tak-çıkar bir donanım gibi kullanan modüler bir finansal işletim sistemidir.

### Temel Aksiyomlar

1. **Ağır Hesaplama PC'de (Local-First Compute Daemon):**
   100.000 mumluk zaman serisi hesaplamaları, backtest simülasyonları, DuckDB analitiği ve yerel OCR PC'de çalışan yerel serviste (`daemon`) koşar. Mobil cihazlar (iOS/Android) yalnızca hafif WebSocket istemcisidir.
2. **Değiştirilebilir Ajan Katmanı (`IAgentDriver`):**
   Tek bir kontrat arkasında Pi CLI, Claude Code API, Codex veya yerel Ollama motorları çalışma anında değiştirilebilir.
3. **Çoklu Çalışma Alanı Matrisi:**
   TradingView Modu (WebGL2 / `@luxalgo/vela`), Binance Terminal Modu (emir defteri / derinlik) ve ChatGPT / Asistan Modu (finansal zengin kartlar).
4. **Sürekli Ajan Tartışma ve Karar Döngüsü (Continuous Multi-Agent Debate Loop):**
   Mimari kararlar tek bir zihnin varsayımlarıyla değil; 6 uzman botun (Birinci İlkeler, Şüpheci, GitHub Analisti, Vizyoner, Web Araştırmacısı ve Hakem) çatışması ve senteziyle GitHub Issues ve ADR'ler üzerinden şekillenir.

---

## 🏗️ Monorepo Mimarisi

```text
finance-opensource/
├── apps/
│   ├── daemon/                 # Yerel PC Arka Plan Servisi (WebSocket / mDNS / IPC)
│   ├── desktop/                # Masaüstü UI (Tauri / Vite)
│   └── mobile/                 # Hafif Mobil Eşlikçi (Expo / React Native)
├── packages/
│   ├── agent-core/             # Değiştirilebilir Ajan İskeleti (Pi, Claude Code, Codex)
│   ├── compute-engine/         # İndikatörler (RSI, MACD), Backtest ve Veri Katmanı
│   ├── data-connectors/        # Binance, Kraken, FRED, EVDS Normalleştirici
│   ├── protocol/               # IPC / WebSocket Zod Şemaları ve Olaylar
│   └── ui-workspaces/          # Vela WebGL2, Terminal ve Asistan Görünümleri
├── adr/                        # Mimari Karar Kayıtları (Architecture Decision Records)
│   ├── ADR-001-storage-concurrency-duckdb-vs-sqlite.md
│   ├── ADR-002-daemon-networking-sleeping-pc-remote-access.md
│   ├── ADR-003-charting-engine-vela-pinets-vs-lightweight-charts.md
│   └── ADR-004-swappable-agent-runtime-abstraction.md
└── scripts/
    └── debate-loop.ts          # 6 Ajanlı Sürekli Çatışma & Sentezleme Motoru
```

---

## 👥 Analiz Takımı Rolleri ve Çatışma Döngüsü

Bu repo, aşağıdaki 6 sanal uzmanın birbirini sorgulaması ve Hakem'in nihai kararıyla yönetilir:

| Rol | Görev & Karakter | Odak Alanı |
|---|---|---|
| **Birinci İlkeler Mühendisi** | Temel fizik, matematik ve kısıtlar | Termal bütçe, I/O darboğazı, minimal bağımlılık |
| **Şüpheci (Şeytanın Avukatı)** | Gizli varsayımları ve çöküş senaryolarını bulur | Ağ kopmaları, uyuyan PC, veri bozulması |
| **GitHub Kaynak Analisti** | Canlı kodları, issue ve commit geçmişlerini inceler | Gerçek bug'lar, deadlock issue'ları, kütüphane riskleri |
| **Vizyoner (Fırsat Avcısı)** | Sistemin en uç potansiyelini tasarlar | Kişisel otonom hedge fonu, egemen finans |
| **Web Araştırmacısı** | Global emsalleri, akademik makaleleri ve dokümanları tarar | Çin/Rus/ABD ekosistemleri, latency analizleri |
| **Hakem (Sentezci)** | Çatışmaları delille çözer, nihai kararı verir | ADR yazımı, bilinmeyenlerin test planı |

---

## 🚀 Hızlı Başlangıç

```bash
# Depoyu klonlayın
git clone https://github.com/alicomert/finance-opensource.git
cd finance-opensource

# Bağımlılıkları yükleyin
pnpm install

# Testleri çalıştırın
pnpm test

# Ajan Tartışma Döngüsünü başlatın
pnpm debate:loop
```

---

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
