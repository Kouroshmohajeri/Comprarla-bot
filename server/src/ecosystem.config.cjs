module.exports = {
  apps: [
    {
      name: "teleBot",
      script: "./src/teleBot.js",
      instances: 1, // Or "max" to scale across CPUs
      autorestart: true, // Restart on crash
      watch: false, // Don't restart on file changes
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      env: {
        NODE_ENV: "production",
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN, // Make sure this is set
        BACKEND_URL: process.env.BACKEND_URL, // Ensure your backend URL is set
        AUTHORIZED_USER_IDS: process.env.AUTHORIZED_USER_IDS, // Set this correctly
        BOT_URL: process.env.BOT_URL, // This should match your bot's URL
      },
      out_file: "./logs/teleBot_out.log", // Standard output log
      error_file: "./logs/teleBot_err.log", // Error log
      log_date_format: "YYYY-MM-DD HH:mm:ss Z", // Timestamps for logs
    },
  ],
};
