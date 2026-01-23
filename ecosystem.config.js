module.exports = {
  apps: [
    {
      name: "286-frontend",
      script: "server.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        // Aquí definimos las variables "de sistema" directamente
        NODE_ENV: "production",
        PORT: 3000, // Puerto obligatorio para que NGINX sepa dónde buscar
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};