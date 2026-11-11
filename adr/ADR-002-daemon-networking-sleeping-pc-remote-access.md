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

1. **Katmanlı Sıfır Yapılandırmalı Bağlantı (Zero-Config Tiered Networking):**
   - **Kademe 1 (Aynı Ağ - LAN):** mDNS Bonjour yayını ile sıfır gecikmeli yerel WebSocket bağlantısı (internet yokken dahi çalışır).
   - **Kademe 2 (Farklı Ağ / Hücresel - WAN):** Kullanıcıya port açtırmayan, QR kod eşleşmeli gömülü **WebRTC DataChannel (P2P)** bağlantısı. Üçüncü taraf VPN/Tailscale zorunluluğu kaldırılmıştır; doğrudan tarayıcı/mobil P2P tüneli kurulur.
2. **Kilitli Kasa Tasfiye Kalkanı (Server-Side Native Failsafe):**
   - Kırmızı Takım'ın tasfiye senaryosunu engellemek amacıyla; tüm Stop-Loss ve Take-Profit emirleri yerel daemon üzerinde değil, **doğrudan borsa sunucusuna (Server-side Native OCO/SL)** iletilir.
   - PC kapağı kapansa, elektrik kesilse veya ağ kopsa dahi borsa motoru açık pozisyonu korur; PC çöküşü likidasyona yol açamaz.
3. **PC Güç Yönetimi:**
   - Daemon Windows üzerinde `SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_AWAYMODE_REQUIRED)` çağrısı ile ekran kapalıyken dahi CPU ve ağ kartını uyanık tutar.
   - Mobil istemci PC ile bağlantı 60 saniye kesildiğinde kullanıcıyı yerel acil durum bildirimiyle uyarır ve tek tuşla borsa acil iptal seçeneği sunar.

---

## 3. Ayakta Kalan İtirazlar & Test Edilecek Bilinmeyenler

- **Ayakta Kalan İtiraz (Şüpheci):** Ücretsiz genel STUN/TURN sunucularının yüksek volatilite anında paket gecikmesi yaşaması.
- **Test Edilecek Bilinmeyen:** Wi-Fi'dan 4G/5G hücresel ağa geçişte WebRTC ICE restart gecikmesi ve emir TTL davranışı.
