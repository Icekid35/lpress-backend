import * as cron from 'node-cron';
import { supabase } from '../config/supabase';

export class KeepAliveService {
  private serverUrl: string;
  private pingTask: cron.ScheduledTask | null = null;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  start(): void {
    this.pingTask = cron.schedule('*/14 * * * *', async () => {
      await this.performKeepAlive();
    });

    console.log('🔄 Keep-alive service started (runs every 14 minutes)');

    setTimeout(() => {
      this.performKeepAlive();
    }, 60000);
  }

  stop(): void {
    if (this.pingTask) {
      this.pingTask.stop();
      this.pingTask = null;
      console.log('🛑 Keep-alive service stopped');
    }
  }

  private async performKeepAlive(): Promise<void> {
    const timestamp = new Date().toISOString();

    try {
      await this.pingServer();

      await this.pingDatabase();

      console.log(`✅ Keep-alive ping successful at ${timestamp}`);
    } catch (error) {
      console.error(`❌ Keep-alive ping failed at ${timestamp}:`, error);
    }
  }

  private async pingServer(): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/health`);

      if (!response.ok) {
        throw new Error(`Server ping failed with status: ${response.status}`);
      }

      const data = (await response.json()) as { message?: string };
      console.log(`  📡 Server ping: ${data.message || 'OK'}`);
    } catch (error) {
      console.error('  ❌ Server ping error:', error);
      throw error;
    }
  }

  private async pingDatabase(): Promise<void> {
    try {
      const { error } = await supabase.from('projects').select('id').limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      console.log('  🗄️  Database ping: Connection active');
    } catch (error) {
      console.error('  ❌ Database ping error:', error);
      throw error;
    }
  }
}

export default KeepAliveService;
