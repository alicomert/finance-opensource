# ADR-002: Daemon İletişimi — "Uyuyan PC" ve Hücresel Ağ İzolasyonu

**Durum:** KABUL EDİLDİ  
**Karar Verici:** Hakem (Sentezci)  
**Etkilenen Katmanlar:** `apps/daemon/src/discovery.ts`, `apps/mobile/`

---

## 1. Çatışma Özeti ve Tarafların Tezler

### 🔴 Birinci İlkeler Mühendisi: "Yerel Ağ (LAN) ve mDNS Yeterlidir"
> *"Tüm karmaşıklığı atın. Bilgisayar ile telefon aynı Wi-Fi ağındayken mDNS (`_finance-core._tcp`) yayınıyla birbirini bulur, yerel WebSocket üzerinden şifreli konuşur. Bulut sunucusu maliyeti sıfırdır."*

### 🔴 Şüpheci: "Gerçek Dünyada Bu Sistem Çöker"
> *"1. Kullanıcı ofise veya dışarı gittiğinde (hücresel veri / farklı Wi-Fi) telefon PC'yi nasıl bulacak? CGNAT arkasında port açmak imkansızdır.  
> 2. Laptop kapağı kapandığında veya masaüstü uyku moduna geçtiğinde daemon ölür. Kullanıcı mobil arayüzde 'Bağlantı koptu' hatasıyla baş başa kalır."*

### 🟡 GitHub Analisti & Web Araştırmacısı: "Mesh VPN ve Push Relay Emsalleri"
> *"Immich, Syncthing ve Tailscale bu sorunu çözdü. Kullanıcının genel IP'sine ihtiyaç duymadan WireGuard tabanlı P2P mesh ağı (veya Cloudflare Tunnels) kurulabiliyor. Uyandırma için ise yerel ağda Wake-on-LAN (WoL), dışarıda ise OS düzeyinde 'Keep-Alive Daemon Service' kullanılıyor."*

---

## 2. Hakem Kararı ve Sentez

1. **Katmanlı Keşif ve Bağlantı (Tiered Fallback):**
   - **Kademe 1 (Aynı Ağ):** mDNS Bonjour yayını ile sıfır gecikmeli yerel IP bağlantısı.
   - **Kademe 2 (Farklı Ağ / Hücresel):** Kullanıcı dostu Tailscale / WireGuard Derp P2P tüneli veya opsiyonel uçtan uca şifreli Cloudflare Tunnel.
2. **PC Güç Yönetimi:**
   - Daemon Windows'ta `SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED)` çağrısı ile PC'nin işlem yaparken derin uykuya dalmasını engeller (ekran kapanabilir ama CPU uyanık kalır).
   - Mobil istemci bağlantı koptuğunda hafif bir push bildirimiyle kullanıcıyı uyarır ve son portföy anlık görüntüsünü (snapshot cache) gösterir.

---

## 3. Ayakta Kalan İtirazlar & Test Edilecek Bilinmeyenler

- **İtiraz:** Şüpheci: "Kullanıcıya Tailscale kurdurmak sürtünmeyi artırır."
- **Sentez Cevabı:** Sıfır yapılandırmalı gömülü WebRTC veri kanalı (DataChannel) araştırılacak.
