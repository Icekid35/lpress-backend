module.exports = {
  apps: [
    {
      name: 'lpres-admin-backend',
      script: '/dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      // Restart configuration
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Advanced restart strategies
      exp_backoff_restart_delay: 100,
      listen_timeout: 3000,
      kill_timeout: 5000,
    },
  ],
};
