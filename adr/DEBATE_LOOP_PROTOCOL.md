# DEBATE_LOOP_PROTOCOL: Sürekli Çoklu Ajan Çatışma ve Sentez Protokolü

Bu protokol, **Açık Kaynak Finans Sistemi Analiz Takımı**'nın mimari ve kod kararlarını 7/24 döngüsel (loop) olarak geliştirmesi, birbirini etiketlemesi ve karara bağlaması için tanımlanmıştır.

---

## 1. Döngü Aşamaları (The Loop Lifecycle)

```text
[1. Tez / Aksiyom]  -->  [2. Antitez / Şüphe]  -->  [3. Ampirik Delil / Issue]
(Mühendis)               (Şüpheci)                  (GitHub Analisti)
         |                                                 |
         v                                                 v
[6. Nihai Sentez / ADR] <-- [5. Global Emsaller] <-- [4. Vizyon / Potansiyel]
(Hakem)                     (Web Araştırmacısı)      (Vizyoner)
```

1. **Aşama 1 — Aksiyom ve Mimari Teklif (`@BirinciIlkelerMuhendisi`):**
   - Problemi termodinamik, CPU/RAM kısıtı ve en yalın kod seviyesine indirger.
2. **Aşama 2 — Çöküş Senaryoları (`@Supheci`):**
   - Teklifin koptuğu 3 gizli varsayımı bulur. "Sistem şu 3 nedenden çöker" diyerek saldırır.
3. **Aşama 3 — Kod ve Issue Kanıtı (`@GitHubKaynakAnalisti`):**
   - Teoriyle değil, canlı repolardaki commit, PR ve açık/kapalı issue kayıtlarıyla konuşur.
4. **Aşama 4 — Fırsat ve Uç Senaryo (`@Vizyoner`):**
   - Sistemin kusursuz çalışması durumunda kazanılacak stratejik üstünlüğü modeller.
5. **Aşama 5 — Küresel Emsal ve Benchmark (`@WebArastirmacisi`):**
   - Çin, ABD, Rusya quant ekosistemlerindeki akademik makaleleri ve canlı mimarileri getirir.
6. **Aşama 6 — Hakem Kararı ve Sentez (`@Hakem`):**
   - Anlaşmazlıkları sıralar, güçlü kanıtı seçer, ADR dosyasını commit eder ve bilinmeyenlerin test kodunu yazar.

---

## 2. Etiketleme ve Paslaşma Kuralları

- Bir ajan diğerine itiraz ederken mutlaka rol adıyla etiketler (örneğin: `@Supheci, DuckDB kilitlenmesini nasıl aşacaksın?`).
- Tartışmalar dosya formatında (`adr/` veya `debates/`) veya GitHub Issue / PR review formatında saklanır.
- Tartışma sonuca bağlanmadan döngü durmaz; Hakem her turda "Ayakta Kalan İtirazlar" listesini günceller.
