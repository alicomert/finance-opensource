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

## 2. Hakem Kararı ve Sentez: 3 Katmanlı Ayrık Depolama (L1 Ring-Buffer + L2 SQLite WAL + L3 Parquet/DuckDB)

Hakem olarak Mühendisin analitik hız ihtiyacını, Yanal Düşünür'ün "Arı Kursağı" (Honey-Crop) modelini ve GitHub Analisti ile Şüpheci'nin kilitlenme kanıtlarını sentezleyen **3 Katmanlı Mimarisi** onaylanmıştır:

1. **L1 Uçucu Katman (Honey-Crop / Ring Buffer):**
   - Canlı WebSocket tick verileri doğrudan RAM'de tahsisatsız (Zero-Allocation TypedArray) dairesel arabellekte (Ring Buffer) işlenir. Sıfır I/O, sıfır kilitlenme.
2. **L2 Sıcak Katman (Hot Storage - SQLite WAL Modu):**
   - 1 dakikalık kapanmış mumlar, açık emirler, kullanıcı ayarları ve anlık portföy bakiyesi **SQLite** içine yazılır.
   - `PRAGMA journal_mode = WAL;` ve `PRAGMA synchronous = NORMAL;` ile tek yazıcı (WebSocket ingest worker) ve sınırsız paralel okuyucu (UI & Ajanlar) kilitlenmeden çalışır.
3. **L3 Soğuk Katman (Cold Storage - DuckDB / Parquet Bölümleme):**
   - 24 saati aşan tarihsel mumlar `sqlite3_backup` ve chunk bazlı atomik aktarımla sıkıştırılmış `.parquet` dosyalarına dökülür.
   - DuckDB bu dosyalara yalnızca **READ-ONLY** veya izole bellek içi (`:memory:`) oturumlarla bağlanarak vektör hesaplamalarını ve backtest'leri yapar.
   - Canlı veri yazma hattı ile analitik sorgu hattı fiziksel olarak ayrılmıştır; kilitlenme imkânsızdır.

---

## 3. Ayakta Kalan İtirazlar & Test Edilecek Bilinmeyenler

- **Ayakta Kalan İtiraz (Şüpheci & Kırmızı Takım):** SQLite WAL checkpoint sırasında PC'ye aniden elektrik kesintisi gelmesi veya işletim sisteminin kapanması durumunda Parquet transfer bütünlüğü.
- **Test Edilecek Bilinmeyen:** `pnpm test:concurrency` ile saniyede 2.000 işlem yazılırken süreç `SIGKILL` ile durdurulacak ve WAL recovery doğrulanacaktır.
