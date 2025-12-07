import app from './app';
import config from './config';

const PORT = config.port;

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
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
