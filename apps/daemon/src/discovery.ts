export interface ServiceAnnouncement {
  name: string;
  type: string;
  port: number;
  txtRecord: Record<string, string>;
}

export class DaemonDiscoveryService {
  private isBroadcasting = false;

  public startBroadcast(port: number): ServiceAnnouncement {
    this.isBroadcasting = true;
    const announcement: ServiceAnnouncement = {
      name: 'FinanceLocalCore',
      type: '_finance-core._tcp',
      port,
      txtRecord: {
        version: '0.1.0',
        platform: process.platform,
        authRequired: 'true'
      }
    };
    console.log(`[mDNS Broadcast] PC Daemon duyurusu yayında: ${announcement.type} on port ${port}`);
    return announcement;
  }

  public stopBroadcast(): void {
    this.isBroadcasting = false;
    console.log('[mDNS Broadcast] Servis duyurusu durduruldu.');
  }

  public get active(): boolean {
    return this.isBroadcasting;
  }
}
