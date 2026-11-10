import { FinanceDaemonServer } from './server.js';

async function main() {
  const daemon = new FinanceDaemonServer(4820);
  await daemon.start();

  // Test amaçlı bir ajan mesajı simülasyonu
  console.log('\n--- [Canlı Test: Ajan Motoru & Araç Çağrısı] ---');
  const manager = daemon.getManager();
  const session = 'test-session-1';
  
  await manager.current.sendMessage(session, 'Portföy durumumu ve BTC RSI değerini kontrol et', (chunk) => {
    if (chunk.type === 'status-update') {
      console.log(`[Stream Status] ${chunk.status}`);
    } else if (chunk.type === 'text-delta') {
      console.log(`[Stream Delta] ${chunk.delta}`);
    }
  });

  console.log('\n--- [Daemon hazır ve beklemede] ---');
}

main().catch(console.error);
