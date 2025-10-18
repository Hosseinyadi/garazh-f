module.exports = {
  apps: [
    {
      name: 'bil-flow-server',
      script: 'server.js',
      cwd: __dirname,
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '512M',
      watch: false,
      time: true,
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true
    }
  ]
};
