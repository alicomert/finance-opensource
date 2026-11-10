# ADR-001: Veri Depolama Mimarisi — DuckDB Concurrency vs. SQLite WAL (Hibrit Çözüm)

**Durum:** KABUL EDİLDİ  
**Karar Verici:** Hakem (Sentezci)  
**Etkilenen Katmanlar:** `packages/compute-engine/src/storage/`

---

## 1. Çatışma Özeti ve Tarafların Tezler

### 🔴 Birinci İlkeler Mühendisi: "DuckDB veya Parquet Kaçınılmazdır"
> *"100.000 mumluk zaman serisi üzerinde RSI ve backtest hesaplamak için satır bazlı SQLite kullanmak I/O cinayetidir. Sütunsal sıkıştırma (Parquet) ve SIMD vektör operasyonları olmadan yerel PC motoru çöker."*

### 🔴 Şüpheci & GitHub Kaynak Analisti: "DuckDB Deadlock Felaketidir"
> *"DuckDB dosya kilitlenme modeli (`duckdb/duckdb` Issue #2234 & #4921) canlı emir defterinde patlar. WebSocket saniyede 500 tick basarken, arka planda LLM 'son 30 günlük volatiliteyi çıkar' dediği an DuckDB dosya kilidine takılır ve `IOException: Could not set lock on file` fırlatır. Uygulama donar."*

### 🟡 Web Araştırmacısı: "Endüstri Standartları Ne Yapıyor?"
> *"Actual Budget ve kurumsal quant terminalleri (KDB+, InfluxDB, QuestDB) incelendiğinde; hiçbir modern sistem anlık operasyonel kayıt (OLTP) ile analitik taramayı (OLAP) tek bir gömülü dosya kilit mekanizmasında birleştirmez."*

---

## 2. Hakem Kararı ve Sentez: Çift Katmanlı Hibrit Depolama (Dual-Engine Storage)

Hakem olarak Mühendisin analitik hız ihtiyacını ve GitHub Analistinin somut kilitlenme uyarısını birleştiren **Hibrit Mimariyi** onaylıyorum:

1. **Sıcak Katman (Hot Storage - SQLite WAL Modu):**
   - Son 24 saatlik anlık tick verileri, açık emirler, kullanıcı ayarları ve aktif portföy bakiyesi **SQLite** içinde tutulur.
   - `PRAGMA journal_mode = WAL;` ve `PRAGMA synchronous = NORMAL;` ile tek yazıcı (WebSocket ingest) ve sınırsız paralel okuyucu (UI & Ajanlar) kilitlenmeden çalışır.
2. **Soğuk Katman (Cold Storage - DuckDB / Parquet Bölümleme):**
   - 24 saati aşan tarihsel mumlar günlük/aylık `.parquet` dosyalarına aktarılır (Archiver Job).
   - DuckDB bu dosyalara yalnızca **READ-ONLY** veya izole bellek içi (`:memory:`) oturumlarla bağlanarak vektör hesaplamalarını yapar.
   - Böylece DuckDB yazma kilidi hiçbir zaman WebSocket canlı akışını engellemez.

---

## 3. Ayakta Kalan İtirazlar & Test Edilecek Bilinmeyenler

- **İtiraz:** SQLite'tan Parquet'ye aktarım sırasında RAM sıçraması (OOM) riski.
- **Bilinmeyen:** PC uyku moduna geçerken WAL checkpoint işleminin yarıda kalıp kalmayacağı.
- **Test:** `pnpm test:concurrency` ile 1.000 req/sec yazma sırasında 100.000 satırlık DuckDB sorgusu eşzamanlı çalıştırılacak.
