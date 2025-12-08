import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  serverUrl: process.env.SERVER_URL || `http://localhost:${process.env.PORT || '5000'}`,

  adminSecretKey: process.env.ADMIN_SECRET_KEY,

  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  keepAlive: {
    enabled: process.env.KEEP_ALIVE_ENABLED !== 'false', // Enabled by default
    intervalMinutes: parseInt(process.env.KEEP_ALIVE_INTERVAL_MINUTES || '14', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ],
  },

  // Email/Newsletter Settings
  email: {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    fromName: process.env.EMAIL_FROM_NAME || 'LPRES Administration',
  },
};

export default config;
