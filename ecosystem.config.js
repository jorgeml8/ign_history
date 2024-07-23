module.exports = {
    apps: [
      {
        name: 'ign_history',
        script: 'app.js', // Asegúrate de que este es el punto de entrada de tu aplicación
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'DEV',
        },
      },
    ],
  };
  