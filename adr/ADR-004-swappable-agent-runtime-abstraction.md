# ADR-004: Değiştirilebilir Ajan Çekirdeği — IAgentDriver Soyutlaması

**Durum:** KABUL EDİLDİ  
**Karar Verici:** Hakem (Sentezci)  
**Etkilenen Katmanlar:** `packages/agent-core/src/contracts/agent.ts`, `packages/agent-core/src/manager.ts`

---

## 1. Çatışma Özeti

### 🔴 Vizyoner: "Kullanıcı İstediği An En Güçlü Modeli Seçebilmeli"
> *"Bugün Claude 3.7 Sonnet lider, yarın OpenAI Codex öne geçer, ertesi gün yerel DeepSeek/Llama PC'de uçar. Finans motoru tek bir LLM API'sine bağımlı kalırsa ölür."*

### 🔴 Şüpheci: "Her Modelin Tool Calling Protokolü ve Streaming Yapısı Farklıdır"
> *"Pi CLI, Claude Code ve Codex bambaşka prompt yapılarına ve araç formatlarına sahip. Bunu tek bir arayüze indirmeye çalışmak en küçük ortak paydada vasatlığa yol açar."*

---

## 2. Hakem Kararı ve Sentez

1. **Ortak Sözleşme (`IAgentDriver`):**
   - Her motor adaptörü (Driver) initialize, registerTools, createSession, sendMessage ve abort metodlarını sağlamalıdır.
   - Araçlar JSON Schema standardında tanımlanır; adaptörler bunu hedef motorun native formatına çevirir (MCP / Anthropic tools / OpenAI function calling).
2. **İki Katmanlı Tavsiye ve Yürütme Mimarisi (Dual-Envelope Architecture):**
   - **Bilişsel Katman (LLM / Agent):** Pi, Claude Code, Codex veya Ollama; yalnızca analiz yapar ve `OrderProposal` (Emir Teklifi) nesnesi oluşturur. Doğrudan borsa API'sine erişemez.
   - **Deterministik Risk Kalkanı (RiskGuard):** Teklif edilen emirler katı TypeScript kurallarıyla denetlenir:
     - Tek işlemde azami sermaye riski (örn. bakiyenin %1'i).
     - Günlük devre kesici (Circuit Breaker: %3 kayıpta 24 saat işlem kilidi).
     - Acemi kullanıcı modu: Kullanıcı mobil push bildiriminden "Onayla" butonuna basmadıkça emir borsaya iletilemez.
3. **Çalışma Anında Geçiş ve Maliyet Kalkanı:**
   - `AgentEngineManager.switchDriver('pi' | 'claude-code' | 'codex' | 'ollama')` çağrısı oturum durumunu koruyarak motoru anında değiştirir.
   - 100 saatlik otonom tartışma döngüleri için deterministik `MockAgentDriver` veya yerel Ollama motoru kullanılır; bulut modelleri için saatlik harcama kotası uygulanır.

---

## 3. Ayakta Kalan İtirazlar & Test Edilecek Bilinmeyenler

- **Ayakta Kalan İtiraz (Vizyoner):** Mikrosaniyelik istatistiksel arbitrajda kullanıcı onayının fırsatı kaçırması (HFT işlemleri LLM'e değil, `compute-engine` C++/Rust algoritmalarına devredilmiştir).
- **Test Edilecek Bilinmeyen:** Claude Sonnet vs OpenAI vs DeepSeek modellerinin Zod şemalı finans araçlarını çağırma hata ve halüsinasyon oranları (`pnpm test:headless`).
