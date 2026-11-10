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

1. **Grafik Motoru:** `@luxalgo/vela` (WebGL2) birincil görselleştirme motoru olarak seçilmiştir.
2. **Pine Script İzolasyonu:** `@luxalgo/vela-pinets` derleyicisi ve çalışma zamanı **Web Worker** içine hapsedilir. Ana UI thread'i yalnızca çizim emirlerini (JSON drawing instructions) alır.
3. **Fallback:** Düşük donanımlı mobil cihazlarda isteğe bağlı hafif 2D mod korunur.
