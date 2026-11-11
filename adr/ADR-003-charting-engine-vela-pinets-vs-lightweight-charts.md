# ADR-003: Grafik ve Strateji Motoru — @luxalgo/vela ve vela-pinets Entegrasyonu

**Durum:** KABUL EDİLDİ  
**Karar Verici:** Hakem (Sentezci)  
**Etkilenen Katmanlar:** `packages/ui-workspaces/`, `packages/compute-engine/`

---

## 1. Çatışma Özeti

### 🔴 Birinci İlkeler Mühendisi: "2D Canvas (Lightweight Charts) Yeterli"
> *"TradingView'in açık kaynak Lightweight Charts kütüphanesi hafiftir ve iş görür. Ekstra karmaşıklığa gerek yoktur."*

### 🔴 GitHub Kaynak Analisti: "Lightweight Charts Çıkmaz Sokaktır"
> *"Lightweight Charts yalnızca çizgi ve mum çizer. Kullanıcı Pine Script v5/v6 stratejilerini derleyemez, 70+ indikatörü render edemez. Dünyada açık kaynak olarak WebGL2 mimarisinde 100.000 mumu 60 FPS çizen ve Pine Script v6'yı Web Worker içinde TypeScript'e derleyen tek kütüphane **`@luxalgo/vela`** ve **`@luxalgo/vela-pinets`** ikilisidir."*

### 🔴 Şüpheci: "Pine Script Derleyicisi UI Thread'ini Kilitler"
> *"Kullanıcı 500 satırlık karmaşık bir Pine Script yazdığında derleme ve döngüler arayüzü dondurur, tarayıcı 'Sayfa Yanıt Vermiyor' uyarısı verir."*

---

## 2. Hakem Kararı ve Sentez

1. **Donanıma Duyarlı Çift Çizim Hattı (Dual-Render Engine):**
   - **Masaüstü ve Yüksek Performanslı İstemciler:** `@luxalgo/vela` (WebGL2) birincil motor olarak kullanılır; 100.000 mumu 60 FPS akıcı çizer.
   - **Mobil ve Pil Tasarruf Modu:** Düşük donanımlı cihazlarda otomatik olarak TradingView Lightweight Charts (2D Canvas) moduna düşülür (Graceful Degradation).
2. **Pine Script Sandboxing ve Watchdog Zamanlayıcısı:**
   - `@luxalgo/vela-pinets` derleyicisi ve çalışma zamanı **Web Worker** içine hapsedilir.
   - Script yürütmesine katı bir **Watchdog Timer (azami 500ms bütçe)** konur. Sonsuz döngüye giren veya bütçeyi aşan betik anında sonlandırılır (`worker.terminate()`); ana kullanıcı arayüzü tek bir kare bile takılmaz.
3. **Uyarlanabilir LoD (Adaptive Level of Detail):**
   - 100.000 mum dahi olsa ekrandaki yatay piksel yoğunluğu kadar veri LTTB algoritması ile GPU'ya basılır; gereksiz draw call'lar engellenir, fanlar bağırmaz.
4. **Otomatik WebGL Context Recovery:**
   - `webglcontextlost` olayı dinlenir; GPU belleği tükendiğinde motor çökmeden oturumu temizler ve 2D Canvas moduna kesintisiz geçiş yapar.

---

## 3. Ayakta Kalan İtirazlar & Test Edilecek Bilinmeyenler

- **Ayakta Kalan İtiraz (Şüpheci):** iOS Safari üzerinde arka plana atılan sekmelerde WebGL bellek temizliğinin gecikmesi.
- **Test Edilecek Bilinmeyen:** 100.000 mum + 10 aktif indikatör + özel Pine Script çalışırken 1 saatlik bellek sızıntısı (memory leak) testi.
