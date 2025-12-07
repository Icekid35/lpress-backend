import app from './app';
import config from './config';
import KeepAliveService from './services/keepalive';

const PORT = config.port;
let keepAliveService: KeepAliveService | null = null;

const server = app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🚀 LPRES Admin API Server`);
  console.log('🚀 ========================================');
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('🚀 ========================================');
  console.log(`📡 API Base: http://localhost:${PORT}/api/${config.apiVersion}`);
  console.log(`   - Projects: /projects`);
  console.log(`   - News: /news`);
  console.log(`   - Complaints: /complaints`);
  console.log(`   - Subscribers: /subscribers`);
  console.log('🚀 ========================================');

  if (config.keepAlive.enabled) {
    keepAliveService = new KeepAliveService(config.serverUrl);
    keepAliveService.start();
  } else {
    console.log('ℹ️  Keep-alive service is disabled');
  }
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  if (keepAliveService) {
    keepAliveService.stop();
  }
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  if (keepAliveService) {
    keepAliveService.stop();
  }
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err: Error) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  if (keepAliveService) {
    keepAliveService.stop();
  }
  server.close(() => {
    process.exit(1);
  });
});

export default server;
