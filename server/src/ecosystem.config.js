// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "teleBot",
      script: "./src/teleBot.js",
      instances: 1, // Or you can set it to "max" to run multiple instances
      autorestart: true,
      watch: false,
      max_memory_restart: "1G", // Optional: Restart if memory exceeds 1GB
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
