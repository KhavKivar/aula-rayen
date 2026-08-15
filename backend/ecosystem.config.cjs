module.exports = {
  apps: [
    {
      name: "aula-rayen-backend",
      script: "dist/main.js",
      cwd: "/opt/aula-rayen-backend/current",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
