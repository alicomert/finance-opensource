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
2. **Çalışma Anında Geçiş (Dynamic Engine Swap):**
   - `AgentEngineManager.switchDriver('pi' | 'claude-code' | 'codex')` çağrısı oturum durumunu ve araç listesini koruyarak motoru anında değiştirir.
3. **Maliyet Kalkanı:**
   - Testlerde sıfır maliyetli ve deterministik `MockAgentDriver` kullanılır.
